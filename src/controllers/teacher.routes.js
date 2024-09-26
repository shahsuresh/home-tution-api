import { Router } from "express";
import bcrypt from "bcrypt";
import Teacher from "../models/teacher.model.js";
import validateReqBody from "../middlewares/validation.middleware.js";
import {
  loginTeacherValidationSchema,
  registerTeacherValidationSchema,
  updateTeacherPasswordValidationSchema,
} from "../validations/teacher.validation.js";
import jwt from "jsonwebtoken";
import { isTeacher } from "../middlewares/authentication.middleware.js";
import Tution from "../models/tution.model.js";
import { tutionPostValidationSchema } from "../validations/tution.validation.js";
import { paginationValidationSchema } from "../validations/pagination.validation.js";
import validateMongoIdFromReqParams from "../middlewares/validateMongoID.middleware.js";
import {
  passwordChangedEmail,
  teacherRegistrationSuccessEmail,
} from "../services/emailTemplate.js";
import sendEmail from "../services/email.js";

const router = Router();

//?===== Register Teacher ==================================
router.post(
  "/teacher/register",
  validateReqBody(registerTeacherValidationSchema),
  async (req, res) => {
    // extract new teacher data from req.body
    const newTeacherData = req.body;

    //get teacher fullName
    const teacherFullName = `${newTeacherData.firstName} ${newTeacherData.lastName}`;

    // Generate the HTML content by calling the template function
    const htmlContent = teacherRegistrationSuccessEmail(teacherFullName);

    //check if this user is already registered

    const userEmail = await Teacher.findOne({ email: newTeacherData.email });

    if (userEmail) {
      return res.status(400).send({ message: "Already Registered" });
    }
    // extract password from user data

    const plainPassword = newTeacherData.password;
    const saltRound = 10;
    // convert plain password into hashed password
    const hashedPassword = await bcrypt.hash(plainPassword, saltRound);
    newTeacherData.password = hashedPassword;

    try {
      // register user data in db
      await Teacher.create(newTeacherData);
      //exclude password field from response data
      const responseData = { ...newTeacherData, password: undefined };
      // send email to user with html content
      sendEmail(
        newTeacherData.email,
        "Registration Success",
        "Thank you for registering with us.",
        htmlContent
      );
      // send response

      return res.status(201).send({
        message: `${responseData.firstName.toUpperCase()} Your Registration is Successful`,
      });
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

//?========== Login Teacher =========================
router.post(
  "/teacher/login",
  validateReqBody(loginTeacherValidationSchema),
  async (req, res) => {
    //extract login data from req.body
    const loginData = req.body;
    //search for user using provided email
    const user = await Teacher.findOne({ email: loginData.email });
    if (!user) {
      return res
        .status(404)
        .send({ message: "The email or password you entered is incorrect." });
    }
    // check for password match
    const plainPassword = loginData.password;
    const hashedPassword = user.password;
    const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);
    //if wrong password,throw error
    if (!isPasswordMatch) {
      return res
        .status(404)
        .send({ message: "The email or password you entered is incorrect." });
    }
    //generate access token
    const payload = { id: user._id, email: user.email, name: user.firstName };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SIGNATURE);
    //to hide user password
    user.password = undefined;
    //send response
    return res.status(200).send({
      message: `Login Success:Welcome ${user.firstName} ${user.lastName}`,
      teacherData: user,
      accessToken,
    });
  }
);

//?========== get Profile data =========================

router.get("/teacher/profile", isTeacher, async (req, res) => {
  //extract userID from req
  const userID = req.loggedInUserId;
  //find teacher data using that userID
  const profileData = await Teacher.findOne(
    { _id: userID },
    { _id: 0, updatedAt: 0 }
  );

  if (!profileData) {
    return res.status(400).send({ message: "Error getting your data" });
  }
  profileData.password = undefined;
  //send response
  res.status(200).send({ message: "success", profileData });
});

//?============== Add homeTution Data/post =======================

router.post(
  "/tution/add",
  isTeacher,
  validateReqBody(tutionPostValidationSchema),
  async (req, res) => {
    //extract tution data from req.body
    const tutionData = req.body;

    // extract loggedInUserId from req and add that id to match "teacherDetails"..
    //..field of collection "Tution"
    const loggedInUserId = req.loggedInUserId;
    tutionData.teacherDetails = loggedInUserId;

    //create tution data in db
    await Tution.create(tutionData);
    //send response
    return res.status(200).send({ message: "Details Added Successfully" });
  }
);

//?==================get self posts ====================

router.post(
  "/tution/posts",
  isTeacher,
  validateReqBody(paginationValidationSchema),
  async (req, res) => {
    //extract page and limit data from req.body
    const { page, limit } = req.body;
    //calculate skip and limit
    const skip = (page - 1) * limit;

    //extract userID from req
    const userID = req.loggedInUserId;
    //find posts using that userID
    const posts = await Tution.aggregate([
      {
        $match: { teacherDetails: userID },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          subjects: 1,
          forClass: 1,
          price: 1,
          priceType: 1,
          status: 1,
          // teacherDetails:1,
        },
      },
    ]);

    if (!posts) {
      return res.status(400).send({ message: "You have not posted yet" });
    }
    // calculate page
    const totalPosts = await Tution.find({
      teacherDetails: userID,
    }).countDocuments();

    // total page
    const totalPage = Math.ceil(totalPosts / limit);
    res.status(200).send({ posts: posts, totalPage });
  }
);

//?================== edit self posts ====================

router.put(
  "/tution/posts/edit/:id",
  validateMongoIdFromReqParams,
  isTeacher,
  validateReqBody(tutionPostValidationSchema),
  async (req, res) => {
    //extract post Id from req.params.id
    const postID = req.params.id;
    //find post by postID
    const post = await Tution.findById(postID);
    //if no post found, throw error
    if (!post) {
      return res
        .status(400)
        .send({ message: "You have not posted any tutions yet" });
    }
    //check post ownership
    //! To be post owner: post teacherDetails(id) must be equal to logged in user ID
    const teacherID = post.teacherDetails;
    const loggedInUserId = req.loggedInUserId;
    const isPostOwner = teacherID.equals(loggedInUserId);
    if (!isPostOwner) {
      return res
        .status(400)
        .send({ message: "You are not owner of this post" });
    }
    //extract new post data from req.body
    const postUpdateData = req.body;
    //update/edit post
    await Tution.updateOne({ _id: postID }, { $set: { ...postUpdateData } });
    //send response
    return res
      .status(200)
      .send({ message: "Update successful! Your changes have been saved." });
  }
);

//?==================get tution post details by id(postId) ================

router.get(
  "/tution/posts/:id",
  isTeacher,
  validateMongoIdFromReqParams,
  async (req, res) => {
    //extract postID from req.params.id
    const postID = req.params.id;
    //find tution by that postID
    const post = await Tution.findOne({ _id: postID }).select(
      "-teacherDetails"
    );
    //if no post found, throw error
    if (!post) {
      return res
        .status(400)
        .send({ message: "No tution data exists with this id" });
    }
    //send response
    res.status(200).send({ message: "Success", post });
  }
);

//?================= delete tution post ==================================

router.delete(
  "/tution/posts/delete/:id",
  isTeacher,
  validateMongoIdFromReqParams,
  async (req, res) => {
    //extract post id from req.params.id
    const postID = req.params.id;
    //find post by that postID
    const post = await Tution.findById(postID);
    //if no post, throw error
    if (!post) {
      return res.status(400).send({ message: "No Data found with this ID" });
    }
    //check ownership of that post
    const teacherID = post.teacherDetails;
    const loggedInUserId = req.loggedInUserId;
    const isPostOwner = teacherID.equals(loggedInUserId);
    if (!isPostOwner) {
      return res
        .status(400)
        .send({ message: "You are not owner of this post" });
    }
    //delete post
    await Tution.deleteOne({ _id: postID });
    //send response
    return res
      .status(200)
      .send({ message: "The post has been successfully deleted." });
  }
);

//?================= change password ==================================
router.put(
  "/teacher/profile/change-password",
  isTeacher,
  validateReqBody(updateTeacherPasswordValidationSchema),
  async (req, res) => {
    //extract currentPassword, newPassword, conformNewPassword from req.body
    const { currentPassword, newPassword, conformNewPassword } = req.body;

    //get userId from req
    const loggedInUserId = req.loggedInUserId;

    //get user data from db
    const user = await Teacher.findOne({ _id: loggedInUserId });
    if (!user) {
      return res.status(400).send({ message: "No user found! Login first" });
    }

    // get user fullName

    const teacherFullName = `${user.firstName} ${user.lastName}`;

    // Generate the HTML content by calling the template function

    const htmlContent = passwordChangedEmail(teacherFullName);

    //get user current hashed password from db
    const currentHashedPassword = user.password;

    //compare currentHashedPassword with user current plain password
    const isCurrentPasswordMatch = await bcrypt.compare(
      currentPassword,
      currentHashedPassword
    );

    //if not password matched throw error
    if (!isCurrentPasswordMatch) {
      return res
        .status(400)
        .send({ message: "Incorrect current password. Please try again." });
    }
    //newPassword and conformNewPassword should be same(validated using validation schema)
    //hash new plain password
    const newPlainPassword = conformNewPassword;
    const saltRound = 10;
    const newHashedPassword = await bcrypt.hash(newPlainPassword, saltRound);

    //update password with newHashedPassword
    try {
      await Teacher.updateOne(
        { _id: loggedInUserId },
        { $set: { password: newHashedPassword } }
      );

      //send email to user with html content to notify password change
      sendEmail(
        user.email,
        "Password Changed",
        "Your password has been changed.",
        htmlContent
      );
      return res.status(200).send({
        message:
          "Your password has been successfully changed.\nPlease use your new password the next time you log in.",
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).send({ message: "Error updating your password" });
    }
  }
);

export default router;
