import { Router } from "express";
import { changePassword, forgotPassword, getProfile, login, logout, register, resetPass, updateUser } from "../controller/AuthController";
import { authorise } from "../middleware/AuthMiddleware";
import { requireAuth } from "../middleware/requireAuth";

const Authroutes = Router()

Authroutes.post("/register",register)
Authroutes.post("/login",login)
Authroutes.get("/logout",logout)
Authroutes.get('/profile',getProfile)
Authroutes.post('/forgotPass', forgotPassword)
Authroutes.post('/resetPass',resetPass)
Authroutes.post('/chnagePassword/:id',authorise(['user']) ,changePassword)
Authroutes.patch('/updateProfile', authorise(['user']),updateUser)
Authroutes.get('/me', requireAuth,(req,res)=>{
    res.json({
        user:(req as any).user
    })
    console.log((req as any).user);
    
})

export default Authroutes;