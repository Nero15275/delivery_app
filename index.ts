import express from "express";
import bodyParser from "body-parser";
import { AdminRoute,VendorRoute } from "./src/routes";
import mongoose from "mongoose";
import { dbUrl } from "./src/config";

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/admin",AdminRoute)
app.use("/vendor",VendorRoute)

mongoose.connect(dbUrl,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useCreateIndex:true
}).then((result)=>{
    console.log("Db Connection Successfull");
    
}).catch(err=>{
    console.log(err);
    
})

app.listen(8000,()=>{
    console.clear()
    console.log("server is running on port 8000")
})