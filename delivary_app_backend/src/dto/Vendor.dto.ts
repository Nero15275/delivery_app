export interface CreateVendorInput{
    name:string;
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    email:string;
    password:string;
    phone:number
}

export interface LoginVendorInfo{
    email:string;
    password:string
}

export interface SignaturePayload{
    id:string,
    name:string,
    email:string
}