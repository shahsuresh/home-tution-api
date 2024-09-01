import { Router } from "express";
import bcrypt from "bcrypt";
import Teacher from "../models/teacher.model.js";
import validateReqBody from "../middlewares/validation.middleware.js";
import {
  loginTeacherValidationSchema,
  registerTeacherValidationSchema,
} from "../validations/teacher.validation.js";
import jwt from "jsonwebtoken";
import { isTeacher } from "../middlewares/authentication.middleware.js";
import Tution from "../models/tution.model.js";
import { tutionPostValidationSchema } from "../validations/tution.validation.js";
import { paginationValidationSchema } from "../validations/pagination.validation.js";
import validateMongoIdFromReqParams from "../middlewares/validateMongoID.middleware.js";

const router = Router();

//?===== Register Teacher ==================================
router.post(
  "/teacher/register",
  validateReqBody(registerTeacherValidationSchema),
  async (req, res) => {
    // extract new teacher data from req.body
    const newTeacherData = req.body;

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
    // register user data in db
    await Teacher.create(newTeacherData);
    //exclude password field from response data
    const responseData = { ...newTeacherData, password: undefined };
    // send response

    return res
      .status(201)
      .send({ message: "Registration Success", teacherData: responseData });
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
    const payload = { id: user._id, email: user.email };
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
export default router;
