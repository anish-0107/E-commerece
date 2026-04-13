import { NextFunction, Response } from "express"
import { sessionMap } from "../sessions/sessionStore"
import { AppError } from "../utils/global-Error"
import jwt from "jsonwebtoken"
import { decode } from "node:punycode";
import { log } from "node:console";

export const authorise = (requiredRoles: string[] = []) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.auth_token;


            // 1. Check if token exists
            if (!token) {
                return next(new AppError("Unauthorised - Please login", 401));
            }
            const secret = process.env.JWT_SECRET || "fallback_secret_for_dev_only";
            const decoded: any = jwt.verify(token, secret);

            const userRoles = decoded.role || []

            const sessionData = sessionMap.get(token)


            if (!sessionData) {
                res.clearCookie("sessionId");
                return res.status(401).json({ success: false, error: "Unauthorized: Session invalid or expired" });
            }



            // If requiredRoles is empty, everyone is allowed
            const hasPermission = requiredRoles.length === 0 ||
                userRoles.some((role: string) => requiredRoles.includes(role));

            console.log(hasPermission);


            if (!hasPermission) {
                console.log(`Access Denied. User has: ${decoded.role}, Required: ${requiredRoles}`);
                return next(new AppError("Forbidden: Insufficient permissions", 403));
            }

            // 3. Success: Attach session to request and move to controller
            req.user = sessionData;
            next();
        } catch (error) {
            next(error);
        }
    };
};