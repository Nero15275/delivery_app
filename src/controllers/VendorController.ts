import express ,{Request,Response,NextFunction} from "express";
import { findVendor } from "./AdminController";
import { genrateSignature, validatePassword, verifySignature } from "../utility";
import { EditVendorInput, LoginVendorInfo } from "../dto/Vendor.dto";

export const vendorLogin =async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=<LoginVendorInfo>req.body
    
    if(!email||!password)
        return res.status(422).json({
             message:"Invalid Email or Password"
             })

    const vendorInfo:any = await findVendor('',email)
    console.log(vendorInfo);
    
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
            if(userDetails==null)
                return res.status(200).json({
                    message:"No User found",
                    
                })
            const {password,salt,...others}=userDetails.toObject()
            return res.status(200).json({
                message:"success",
                data:others
            })

        }else{
            
            return res.status(400).json({
                message:user
            })
        }
    }

}

export const viewVendorProfile = async(req:Request,res:Response,next:NextFunction)=>{
    if(req.user){
        const vendorProfile:any =await findVendor(req.user)
        if(vendorProfile==null)
            return res.status(400).json({
                message:"Vendor Not Found"
                 })
        const { password: excludedPassword, salt: excludedSalt, ...others } = vendorProfile.toObject();
        return res.status(200).json({
            message:"Success",
            data:others
             })
    }

}

export const editVendorProfile = async (req:Request,res:Response,next:NextFunction) =>{
    try{
        const { name,phone,address,foodType } =<EditVendorInput>req.body;
    if(req.user){
        const vendorProfile:any =await findVendor(req.user)
        if(vendorProfile==null)
            return res.status(400).json({
                message:"Vendor Not Found"
                 })
       
        vendorProfile.name=name
        vendorProfile.phone=phone
        vendorProfile.address=address
        vendorProfile.foodType=foodType
        const saveResult = vendorProfile.save()
        return res.status(200).json({
            message:"Success",
            data:saveResult
          
             })
    }
}catch(err){
    return res.status(400).json({
        message:err,
        
         })
}

}
