import { Router } from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import { adminDataValidationSchema } from "../validations/admin.validation.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";

const router = Router();

//?============Register Admin===================
router.post(
  "/admin/register",
  validateReqBody(adminDataValidationSchema),
  async (req, res) => {
    //extract admin data from req.body
    const adminData = req.body;
    //check if the admin user is already registered or not
    const isAdminRegistered = await Admin.findOne({ email: adminData.email });
    //if registered,throw error
    if (isAdminRegistered) {
      return res
        .status(400)
        .send({ message: "You have already registered.Login to proceed" });
    }
    //hash password
    const plainPassword = adminData.password;
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRound);
    //replace plain password with hashed password
    adminData.password = hashedPassword;
    //register to database
    await Admin.create(adminData);
    //send response
    return res.status(200).send({ message: "Registration Success" });
  }
);

//export router
export default router;
