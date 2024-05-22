import mongoose, { Schema, Document, Model } from "mongoose";

export interface foodDoc extends Document {
    vendorId: string;
    name: string;
    description: string;
    price: number;
    foodType: string;
    category: string;
    readyTime: number;
    images: [string];
}

const foodSchema = new Schema({
    vendorId: { type: String, required: true },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: { type: Number, required: true },
    foodType: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    readyTime: { type: Number },

    images: { type: [String] }
},
    { timestamps: true }
);

const Food = mongoose.model("food", foodSchema);
export { Food }
