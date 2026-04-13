import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { sessionMap } from "../sessions/sessionStore";
import { log } from "console";

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const sessionId = req.cookies.auth_token;
    console.log(sessionId);


    if (!sessionId) {
        console.log("No Session ID found in request");
        return res.status(401).json({ success: false, error: "Unauthorized: No session cookie found." });
    }

    console.log("Current Map Keys:", Array.from(sessionMap.keys())); // See what's actually inside
    const sessionData = sessionMap.get(sessionId);
    console.log("Middleware found user:", sessionData);

    if (!sessionData) {
        res.clearCookie("sessionId");
        return res.status(401).json({ success: false, error: "Unauthorized: Session invalid or expired" });
    }

    req.user = sessionData;

    // console.log("Attached to req.user:", req.user);
    next();
}
