import { Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { AppDatasorce } from "../data-source"
import { User } from "../entity/User"
import { sessionMap } from "../sessions/sessionStore"

const userRepo = AppDatasorce.getRepository(User)

export const lockUser = catchAsync(async(req:Request, res:Response)=>{
    const id = Number(req.params.id)
    const sessionId = req.cookies.auth_token

    if(!id && isNaN(id)){
        res.json({
            message:"no user found"
        })
    }

    const user = await userRepo.findOne({where:{id:id}})
    if (!user || !sessionId) {
        return res.status(404).json({ message: "User not found in database" });
    }

    user.isLocked = true
    sessionMap.delete(sessionId)

    await userRepo.save(user)

    res.json({ 
        message: `User ${user.name} has been locked successfully`,
        isLocked: user.isLocked 
    });
})

export const unlockUser = catchAsync(async(req:Request, res:Response)=>{
    const id = Number(req.params.id)

    if(!id && isNaN(id)){
        res.json({
            message:"no user found"
        })
    }

    const user = await userRepo.findOne({where:{id:id}})
    if (!user) {
        return res.status(404).json({ message: "User not found in database" });
    }
    user.isLocked = false
    await userRepo.save(user)

    res.json({ 
        message: `User ${user.name} has been unlock successfully`,
        isLocked: user.isLocked 
    });
})


export const getAllUser = catchAsync(async(req:Request, res:Response)=>{

    const Allusers = await userRepo.find()

    res.json({
        message:'fetch all user',
        Allusers

    })
})