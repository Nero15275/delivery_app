import express,{Request,Response,NextFunction} from "express"
import { editVendorProfile, editVendorServiceAvailableFlag, vendorLogin, vendorLoginUsingToken, viewVendorProfile } from "../controllers";
import { verifyVendorAuth } from "../middlewares";


const router = express.Router();

router.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.json({message:"hello from Vendor Route"})
})
router.post("/login",vendorLogin)

router.post("/loginWithToken",vendorLoginUsingToken)
router.get("/profile",verifyVendorAuth,viewVendorProfile)
router.put("/profile/edit",verifyVendorAuth,editVendorProfile)
router.put("/profile/serviceStatus",verifyVendorAuth,editVendorServiceAvailableFlag)

export {router as VendorRoute}