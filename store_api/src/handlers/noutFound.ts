import  { NextFunction, Request, Response,Router } from 'express'
 const notFound = (req:Request,res:Response,next:NextFunction)=>{
    const err = new Error("RESOURCE NOT FOUND")
    return res.status(404).json({error:err.message})
}


export default notFound;