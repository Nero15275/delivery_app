import express,{Request,Response,NextFunction} from "express"
import { vendorLogin, vendorLoginUsingToken } from "../controllers";


const router = express.Router();

router.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.json({message:"hello from Vendor Route"})
})
router.post("/login",vendorLogin)

router.post("/loginWithToken",vendorLoginUsingToken)

export {router as VendorRoute}