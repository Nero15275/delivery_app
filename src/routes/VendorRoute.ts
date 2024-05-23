import express, { Request, Response, NextFunction } from "express"
import { AddFood, editVendorCoverImage, editVendorProfile, editVendorServiceAvailableFlag, getFoodOfVendor, vendorLogin, vendorLoginUsingToken, viewVendorProfile } from "../controllers";
import { verifyVendorAuth } from "../middlewares";
import multer from "multer";
import path from 'path'
import fs from 'fs'


const router = express.Router();

//multer setup////


const UPLOAD_DIR = 'uploads';

// Create the upload directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  // Initialize Multer with the storage configuration
  const upload = multer({ storage }).array('images',10);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "hello from Vendor Route" })
})
router.post("/login", vendorLogin)

router.post("/loginWithToken", vendorLoginUsingToken)
router.get("/profile", verifyVendorAuth, viewVendorProfile)
router.put("/profile/edit", verifyVendorAuth, editVendorProfile)
router.put("/profile/serviceStatus", verifyVendorAuth, editVendorServiceAvailableFlag)
router.put("/profile/updateCoverImage", verifyVendorAuth,upload, editVendorCoverImage)
router.post("/addfood", verifyVendorAuth, upload,AddFood)
router.get("/getfoods", verifyVendorAuth, getFoodOfVendor)

export { router as VendorRoute }