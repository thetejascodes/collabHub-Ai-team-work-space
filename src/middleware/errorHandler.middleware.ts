import type { Request,Response,NextFunction } from "express";

export const errorHandler = (err:any, req:Request,res:Response,next:NextFunction)=>{
    console.error(err)
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });

}

