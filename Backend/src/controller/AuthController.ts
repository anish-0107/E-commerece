import { Request, Response } from "express";
import { AppDatasorce } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AppError } from "../utils/global-Error";
import { sessionMap } from "../sessions/sessionStore";
import { catchAsync } from "../utils/catchAsync";
import nodemailer from 'nodemailer';
const userRepo = AppDatasorce.getRepository(User)

export const register = catchAsync(async (req: Request, res: Response) => {
    const { name, email, passowrd } = req.body

    const user = await userRepo.findOne({ where: { email: email } })

    if (user) {
        throw new AppError("user alrady registred",400)
    }

    const hashpass = await bcrypt.hash(passowrd, 12)

    const userData = await userRepo.create({
        name,
        email,
        role: 'user',
        passowrd: hashpass
    })

    await userRepo.save(userData)
    res.status(201).json({ userData })

})


const getSessionsForUser = (userId: number) => {
    // 1. Get all session data objects from the map
    const allSessions = Array.from(sessionMap.values());

    // 2. Filter by the specific userId
    const userSessions = allSessions.filter(session => session.id === userId);

    return {
        count: userSessions.length,
        sessions: userSessions
    };
};

export const login = catchAsync(async (req: Request, res: Response) => {

    const { email, passowrd } = req.body

    const user = await userRepo.findOne({
        where: { email },
        select: ["id", "passowrd", "role", "isLocked"]
    })

    if (!user) {
        throw new AppError("no user found",404)
    }

    if (user.isLocked) {
        throw new AppError("Account is Locked Contact admin",400)
    }

    const isMatch = await bcrypt.compare(passowrd, user.passowrd)

    if (!isMatch) {
        throw  new AppError("passowrd not match",400)
    }
    //convert the roles in array if roles
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];

    const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
    const token = jwt.sign(
        {
            id: user.id,
            role: userRoles
        },
        secret,
        { expiresIn: '1d' }
    )
    sessionMap.set(token, { id: user.id, role: user.role })
    

    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // for 1 day
    })

    const report = getSessionsForUser(1);
    const report2 = getSessionsForUser(2)

    console.log((report), (report2));

    res.json({
        message: "login sucessfully",
        id: user.id,
        role: user.role
    })
})

export const logout = catchAsync(async (req: Request, res: Response) => {

    const sessionId = req.cookies.auth_token

    if (sessionId) {
        sessionMap.delete(sessionId)
    }
    const report = getSessionsForUser(1);
    const report2 = getSessionsForUser(2)
    console.log((report), (report2));

    res.clearCookie('auth_token',{path:'/'})

    res.status(200).json({ message: "Logout Sucessfully" })
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables!
    pass: process.env.EMAIL_PASS, // Your 16-digit App Password
  },
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body
    const user = await userRepo.findOne({ where: { email: email } })

    if (!user) {
        return new AppError("no user found with this email",404)
    }

    const mockCode = Math.floor(100000 + Math.random() * 90000).toString()

    //code store in db of that user
    user.resetCode = mockCode

    //code expries after 5 min
    user.codeExpiresOn = new Date(Date.now() + 5 * 60000);
    await userRepo.save(user)

    const mailOptions = {
    from: '"Your App Support" <your-email@gmail.com>',
    to: email,
    subject: 'Your Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>Password Reset</h2>
        <p>You requested a password reset. Use the code below to proceed:</p>
        <h1 style="color: #4A90E2;">${mockCode}</h1>
        <p>This code will expire in <b>5 minutes</b>.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
    res.json({
        message: "Reset code generated",
        code: mockCode,
    })
})

export const resetPass = catchAsync(async (req: Request, res: Response) => {

    const { code, email, resetPassword } = req.body

    const user = await userRepo.findOne({ where: { email: email } })

    if (!user) {
        return new AppError("no user found with this email",400)
    }


    if (user.resetCode !== code || user.codeExpiresOn < new Date) {
        res.json({ message: 'otp code is invalid or expired' })
    }

    const hashedpass = await bcrypt.hash(resetPassword, 12)


    user.passowrd = hashedpass
    user.resetCode = null
    user.codeExpiresOn = null

    await userRepo.save(user)
    res.json({ message: 'user updated', user })
})

export const getProfile = catchAsync(async (req: Request, res: Response) => {

    const sessionId = req.cookies.auth_token

    if (!sessionId) {
        throw new AppError('user not logged in',400)
    }

    const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

    const decoded = jwt.verify(sessionId, secret) as any;

    const userId = decoded.id


    if (!userId) {
        res.json({ message: 'user sesion expired' })
    }

    const user = await userRepo.findOne({
        where: { id: userId },
        select: ["id", "name", "email", "role"]
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user })
})

export const updateUser = catchAsync(async (req: Request, res: Response) => {

    const id = Number(req.params)
    const updates = req.body

    delete updates.role;

    const user = await userRepo.findOne({ where: { id: id } })

    if (!user) {
        res.json({ message: "no user found" })
    }

    const updatedData = Object.assign(user, updates)

    if (updates.password) {
        updatedData.password = await bcrypt.hash(updates.password, 12);
    }

    await userRepo.save(updatedData)

    res.status(200).json({
        message: "User updated successfully",
        data: updatedData
    });
})

export const changePassword = async (req: Request, res: Response) => {
    try{
    // 1. Get ID from params and passwords from body
    const id = Number(req.params.id); // Ensure you access .id from params
    const { oldPassword, newPassword } = req.body;    

    // 2. Find the user
    const user = await userRepo.findOne({ where: { id: id } });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    // 3. Verify the 'oldPassword' matches what's in the database
    const isMatch = await bcrypt.compare(oldPassword, user.passowrd);

    if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
    }

    // 4. Hash the 'newPassword'
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    console.log(hashedNewPassword);
    

    // 5. Update and save
    user.passowrd = hashedNewPassword;
    await userRepo.save(user);

    // 6. Response (Don't send the password back in the JSON!)
    res.status(200).json({
        message: "Password updated successfully"
    });
}
catch(err){
    console.log(err);
    res.status(500).json({"error":err})
}
};

const sendResetCode = async (userEmail, randomCode) => {
  try {
    const info = await transporter.sendMail({
      from: '"Support" <your-email@gmail.com>',
      to: userEmail,
      subject: "Password Reset Code",
      html: `<h3>Your Reset Code is:</h3><h1>${randomCode}</h1>`
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    return { success: false, error: err };
  }
};