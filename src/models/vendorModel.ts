import mongoose, { Schema, Model, Document } from "mongoose";

interface vendorData extends Document {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    email: string;
    password: string;
    phone: number;
    salt: string;
    serviceAvaillable: boolean;
    rating: number;
    coverImages: [string]
    foods: any
}

const vendorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    foodType: {
        type: [String]
    },
    pincode: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    serviceAvaillable: {
        type: Boolean
    },
    rating: {
        type: Number
    },
    coverImages: [{
        type: String
    }],
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food'
    }]
},
    {
        timestamps: true
    })


const Vendor = mongoose.model<vendorData>("vendor", vendorSchema)

export { Vendor }