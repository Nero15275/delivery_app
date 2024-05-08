import bcrypt from "bcrypt"
import { SignaturePayload } from "../dto/Vendor.dto"
import  jwt  from "jsonwebtoken"
import { jwt_Key } from "../config"


export const genrateSalt = async()=>{

    return await bcrypt.genSalt()
}

export const encryptPassword = async(password:string,salt:string)=>{

    return await bcrypt.hash(password, salt)

}

export const validatePassword= async (password:string,savedPassword:string,salt:string)=>{

    return await bcrypt.hash(password,salt)===savedPassword
}

export const genrateSignature = async (payload:SignaturePayload)=>{
    
    return  jwt.sign(payload,jwt_Key,{expiresIn:"1d"})

}
export const verifySignature=async (signature:any)=>{
    try{
        return  jwt.verify(signature,jwt_Key)
    }catch(err){
        return err
    }
   
   
   
}