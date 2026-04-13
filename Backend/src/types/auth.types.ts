import { Request } from "express";
import { SessionData } from "../sessions/sessionStore";

export interface AuthRequest extends Request{
    user?:SessionData
}