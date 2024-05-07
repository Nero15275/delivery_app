import express,{Request,Response,NextFunction} from "express"
import { vendorLogin } from "../controllers";


const router = express.Router();

router.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.json({message:"hello from Vendor Route"})
})
router.post("/login",vendorLogin)

export {router as VendorRoute}