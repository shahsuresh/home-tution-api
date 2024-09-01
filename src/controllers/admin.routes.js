import { Router } from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import {
  adminDataValidationSchema,
  adminLoginDataValidationSchema,
  updateAdminProfileValidationSchema,
} from "../validations/admin.validation.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAdmin } from "../middlewares/authentication.middleware.js";

const router = Router();

//?============Register Admin=============================
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

//?============ Login as Admin ===========================
router.post(
  "/admin/login",
  validateReqBody(adminLoginDataValidationSchema),
  async (req, res) => {
    //extract email and password from req.body
    const { email, password } = req.body;
    //search user with provided email
    const user = await Admin.findOne({ email: email });
    //if no user with this email,throw error
    if (!user) {
      return res
        .status(400)
        .send({ message: "The email or password you entered is incorrect." });
    }
    //check for password match
    const hashedPassword = user.password;
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    //if wrong password,throw error
    if (!isPasswordMatch) {
      return res
        .status(400)
        .send({ message: "The email or password you entered is incorrect." });
    }
    //generate accessToken
    const payload = { id: user._id };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SIGNATURE);
    //to hide user password
    user.password = undefined;
    //send response
    return res.status(200).send({
      message: `Login Success:Welcome ${user.firstName} ${user.lastName}`,
      adminData: user,
      accessToken,
    });
  }
);

//?============ get profile/ admin data =================
router.get("/admin/profile", isAdmin, async (req, res) => {
  //extract user _id from req
  const loggedInUserId = req.loggedInUserId;
  //get user data with that _id and unselect password field
  const userData = await Admin.findOne({ _id: loggedInUserId }).select(
    "-password"
  );
  //send response
  return res.status(200).send({ message: "Success", adminData: userData });
});

//?============ edit profile/ admin data =================

router.put(
  "/admin/profile/edit",
  isAdmin,
  validateReqBody(updateAdminProfileValidationSchema),
  async (req, res) => {
    //check for profile ownership
    const loggedInUserId = req.loggedInUserId;
    const newData = req.body;
    await Admin.updateOne({ _id: loggedInUserId }, { $set: { ...newData } });
    return res
      .status(200)
      .send({ message: "Update successful! Your changes have been saved." });
  }
);
//export router
export default router;
