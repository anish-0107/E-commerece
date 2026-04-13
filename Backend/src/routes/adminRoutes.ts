import { Router } from "express";
import { authorise } from "../middleware/AuthMiddleware";
import { getAllUser, lockUser, unlockUser } from "../controller/adminController";

const adminRoutes  = Router()

adminRoutes.put('/lockUser/:id',authorise(['admin']),lockUser)
adminRoutes.put('/unlockUser/:id', unlockUser)
adminRoutes.get('/allusers',getAllUser)

export default adminRoutes
