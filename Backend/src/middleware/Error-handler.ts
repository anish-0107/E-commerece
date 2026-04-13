import { NextFunction, Request, Response } from "express";

export const ErrorHandler = ((err:any, req:Request,res:Response ,next:NextFunction)=>{
    // console.error("Error:" ,err.message);
    console.log("error:", err.stack);
    
const code = err.statusCode || err.status || 500;

    res.status(code).json ({
        error:{
            message:err.message,
            status:code
        }
    })
})
