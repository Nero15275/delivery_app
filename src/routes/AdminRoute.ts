import express,{Request,Response,NextFunction} from "express"
import { createVendor, getVendorById, getVendors } from "../controllers";

const router =express.Router();



router.post('/createVendor',createVendor)

router.get('/getVendor',getVendors)

router.get('/getVendor/:id',getVendorById)


router.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.json({message:"hello from Admin Route"})
})



export {router as AdminRoute}