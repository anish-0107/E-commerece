import { log } from "console";

class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        console.log(message);
        Error.captureStackTrace(this, this.constructor);
    }
}