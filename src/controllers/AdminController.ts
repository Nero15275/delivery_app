import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto/Vendor.dto";
import { Vendor } from "../models";
import { encryptPassword, genrateSalt } from "../utility";


export const createVendor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, phone, email, password, address, pincode, ownerName, foodType } = <CreateVendorInput>req.body
    const vendorCheck = await findVendor('', email)
    if (vendorCheck != null)
        return res.status(409).json({ message: "A vendor exist with this Email Id" })
    try {
        //gen salt
        const salt = await genrateSalt()

        //encrypt password

        const encryptedPassword = await encryptPassword(password, salt)



        const vendorCreate = await Vendor.create({
            name: name,
            phone: phone,
            email: email,
            password: encryptedPassword,
            address: address,
            pincode: pincode,
            ownerName: ownerName,
            foodType: foodType,
            salt: salt,
            rating: 0,
            serviceAvaillable: false,
            coverImages: [],
            foods: []

        })
        const { password: excludedPassword, salt: excludedSalt, _id: excluded_id, ...others } = vendorCreate.toObject();
        return res.status(200).json({
            message: "Success",
            data: { ...others }
        })
    } catch (err: any) {
        return res.status(400).json({
            message: "failed",
            err
        })
    }

}

export const findVendor = async (id: string | undefined, email?: string) => {
    try {
        if (email) {
            return await Vendor.findOne({ email })


        } else {
            return await Vendor.findOne({ _id: id })

        }
    } catch (err) {
        return null
    }
}


export const getVendors = async (req: Request, res: Response, next: NextFunction) => {

    const vendor = await Vendor.find({}, { password: 0, salt: 0 })
    if (vendor.length > 0) {
        return res.status(200).json({
            message: "success",
            data: vendor
        })
    }
    return res.status(404).json({
        message: "No Vendors found"
    })

}



export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.id) {
        const vendor: any = await findVendor(req.params.id)
        if (vendor != null) {
            const { password: excludedPassword, salt: excludedSalt, _id: excluded_id, ...others } = vendor.toObject();
            return res.status(200).json({
                message: "Success",
                data: { ...others }
            })
        }
        return res.status(400).json({
            message: "Failed No vendor Found with this Id",

        })
    }
    else {
        return res.status(422).json({
            message: "Please Send Vendor Id"

        })
    }

}