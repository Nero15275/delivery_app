import express, { Request, Response, NextFunction } from "express";
import { findVendor } from "./AdminController";
import { genrateSignature, validatePassword, verifySignature } from "../utility";
import { EditVendorInput, LoginVendorInfo } from "../dto/Vendor.dto";
import { Vendor } from "../models";
import { Food } from "../models"
import { foodInputCreate } from "../dto/food.dto";

export const vendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    
    const { email, password } = <LoginVendorInfo>req.body

    if (!email || !password)
        return res.status(422).json({
            message: "Invalid Email or Password"
        })

    const vendorInfo: any = await findVendor('', email)
    console.log(vendorInfo);

    if (vendorInfo == null)
        return res.status(404).json({
            message: "User doesn't exist"
        })
    if (await validatePassword(password.toString(), vendorInfo.password, vendorInfo.salt)) {
        const signature = await genrateSignature({
            id: vendorInfo.id,
            name: vendorInfo.name,
            email: vendorInfo.email
        })
        const { password, salt, ...others } = vendorInfo.toObject()
        return res.status(200).json({
            message: "success",
            token: signature,
            data: others
        })
    } else {
        return res.status(400).json({
            message: "Incorrect Email Or Password",

        })
    }
}

export const vendorLoginUsingToken = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body
    if (!token) {
        return res.status(422).json({
            message: "please provide token"
        })
    } else {
        const user: any = await verifySignature(token)
        if (user && user.id) {
            const userDetails: any = await findVendor(user.id)
            if (userDetails == null)
                return res.status(200).json({
                    message: "No User found",

                })
            const { password, salt, ...others } = userDetails.toObject()
            return res.status(200).json({
                message: "success",
                data: others
            })

        } else {

            return res.status(400).json({
                message: user
            })
        }
    }

}

export const viewVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        const vendorProfile: any = await findVendor(req.user)
        if (vendorProfile == null)
            return res.status(400).json({
                message: "Vendor Not Found"
            })
        const { password: excludedPassword, salt: excludedSalt, ...others } = vendorProfile.toObject();
        return res.status(200).json({
            message: "Success",
            data: others
        })
    }

}

export const editVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, phone, address, foodType } = <EditVendorInput>req.body;
        if (req.user) {


            const saveResult = await Vendor.findByIdAndUpdate(req.user, { name, phone, address, foodType }, { new: true })


            return res.status(200).json({
                message: "Success",
                data: saveResult

            })
        }
    } catch (err) {
        return res.status(400).json({
            message: "Update Failed",
            error: err

        })
    }

}

export const editVendorServiceAvailableFlag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { serviceAvaillable } = req.body;
        if (req.user) {


            const saveResult = await Vendor.findByIdAndUpdate(req.user, { serviceAvaillable }, { new: true })


            return res.status(200).json({
                message: "Success",
                data: saveResult

            })
        }
    } catch (err) {
        return res.status(400).json({
            message: "Update Failed",
            error: err

        })
    }

}

export const editVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let coverImages: string[]=[]
        const files =req.files  as Express.Multer.File[]
        if (files.length==0) {
            return res.status(400).json({
                message:"Cover image missing add atleast one image"
            })
        }
        files.map((ele:Express.Multer.File)=>{
            
            coverImages.push(ele.path) 
        })
        console.log(coverImages);
        

        if (req.user) {
            const Vendor: any = await findVendor(req.user);
            Vendor.coverImages.push(...coverImages)
            const result=await Vendor.save()
            return res.status(200).json({
                message: "success",
                data: result
            })
        }
    } catch (err) {
        return res.status(400).json({
            message: "Cover image upload failed",
            error: err
        })
    }
}


// food releted routes//

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let foodImages: string[]=[]
        const files =req.files  as Express.Multer.File[]
        if (files.length==0) {
            return res.status(400).json({
                message:"Food image missing add atleast one image"
            })
        }
        files.map((ele:Express.Multer.File)=>{
            
           foodImages.push(ele.path) 
        })

        const { name,
            description,
            price,
            foodType,
            category,
            readyTime,
        } = <foodInputCreate>req.body;
        if (req.user) {
            const Vendor: any = await findVendor(req.user);

            const saveResult = await Food.create({
                name,
                description,
                price,
                foodType,
                category,
                readyTime,
                images: foodImages,
                vendorId: Vendor._id
            })
            Vendor.foods.push(saveResult)
            const result=await Vendor.save()
            return res.status(200).json({
                message: "success",
                data: result
            })
        }
    } catch (err) {
        return res.status(400).json({
            message: "food Creation Failed",
            error: err
        })
    }
}
export const getFoodOfVendor = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (req.user) {
            const Vendor: any = await findVendor(req.user);
            let foods:any = await Food.find({ vendorId: Vendor._id })
            foods=foods.map((ele:any)=>{
                ele.images= ele.images.map((image:string)=>{
                    return `http://localhost:8000/`+image
                })
                return ele
            })
            return res.status(200).json({
                message: "success",
                data: foods
            })
        }
    } catch (err) {
        return res.status(400).json({
            message: "food fetch Failed",
            error: err
        })
    }
}




