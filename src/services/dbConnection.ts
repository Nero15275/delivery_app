
import mongoose from "mongoose";
import { dbUrl } from "../config";

export default ()=>{
     mongoose.connect(dbUrl,{
        // useNewUrlParser:true,
        // useUnifiedTopology:true,
        // useCreateIndex:true
    }).then((result)=>{
        console.log("Db Connection Successfull");
        
    }).catch(err=>{
        console.log(err);
        
    })
}


