import { Request,Response,NextFunction } from "express";
import { verifySignature } from "../utility";
import { JwtPayload } from "jsonwebtoken";
import { SignaturePayload } from "../dto/Vendor.dto";


declare global {
    namespace Express {
        interface Request {
            user?: string; 
        }
    }
}

export const verifyVendorAuth = async (req:Request,res:Response,next:NextFunction) =>{
   const token =req.headers['authorization']
   if(token){
    const user : SignaturePayload |JwtPayload | any = await verifySignature(token)
    if(user&&user.id){
        req.user=user.id
        next()
    }else{
        return res.status(422).json({
            error:user
        }) 
    }
    
   }else{
    return res.status(422).json({
        message:"please send the token for validation"
    })
   }
     
    
    
  
    
}