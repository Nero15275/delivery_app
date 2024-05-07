import express ,{Request,Response,NextFunction} from "express";
import { findVendor } from "./AdminController";
import { genrateSignature, validatePassword } from "../utility";
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
        const signature = genrateSignature({
            id:vendorInfo.id,
            name:vendorInfo.name,
            email:vendorInfo.email
            })
        return res.status(200).json({
            message:"success",
            data:vendorInfo
        })
    }else{
        return res.status(400).json({
            message:"Incorrect Email Or Password",
            
        })
    }
}

