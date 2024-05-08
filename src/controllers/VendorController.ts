import express ,{Request,Response,NextFunction} from "express";
import { findVendor } from "./AdminController";
import { genrateSignature, validatePassword, verifySignature } from "../utility";
import { LoginVendorInfo } from "../dto/Vendor.dto";

export const vendorLogin =async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=<LoginVendorInfo>req.body
    
    if(!email||!password)
        return res.status(422).json({
             message:"Invalid Email or Password"
             })

    const vendorInfo = await findVendor('',email)
    if(vendorInfo == null)
        return res.status(404).json({
    message:"User doesn't exist"})
    if(await validatePassword(password,vendorInfo.password,vendorInfo.salt)){
        const signature = await genrateSignature({
            id:vendorInfo.id,
            name:vendorInfo.name,
            email:vendorInfo.email
            })
            const {password,salt,...others}=vendorInfo.toObject()
        return res.status(200).json({
            message:"success",
            token:signature,
            data:others
        })
    }else{
        return res.status(400).json({
            message:"Incorrect Email Or Password",
            
        })
    }
}

export const vendorLoginUsingToken= async (req:Request,res:Response,next:NextFunction)=>{
    const {token}=req.body
    if(!token){
        return res.status(422).json({
            message:"please provide token"
        })
    }else{
        const user: any = await verifySignature(token)
        if(user&&user.id){
            const userDetails:any = await findVendor(user.id)
            const {password,salt,...others}=userDetails.toObject()
            return res.status(200).json({
                message:"success",
                data:others
            })

        }else{
            console.log(user);
            
            return res.status(400).json({
                message:user
            })
        }
    }

}

