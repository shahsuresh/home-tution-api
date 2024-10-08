import { Router } from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import {
  adminDataValidationSchema,
  adminLoginDataValidationSchema,
  updateAdminPasswordValidationSchema,
  updateAdminProfileValidationSchema,
} from "../validations/admin.validation.js";
import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAdmin } from "../middlewares/authentication.middleware.js";
import Student from "../models/student.model.js";
import validateMongoIdFromReqParams from "../middlewares/validateMongoID.middleware.js";
import Teacher from "../models/teacher.model.js";
import Tution from "../models/tution.model.js";
import ContactForm from "../models/contactForm.model.js";
import { passwordChangedEmail } from "../services/emailTemplate.js";

const router = Router();

//!=============Admin functions for self profile ==================================

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
    return res.status(200).send({
      message:
        "Welcome! Your account verification is on its way.You will soon receive a confirmation email,once your account is verified . ",
    });
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

//?============ update/change password(admin) =========================
router.put(
  "/admin/profile/change-password",
  isAdmin,
  validateReqBody(updateAdminPasswordValidationSchema),
  async (req, res) => {
    //extract currentPassword, newPassword, conformNewPassword from req.body
    const { currentPassword, newPassword, conformNewPassword } = req.body;
    //get userId from req
    const loggedInUserId = req.loggedInUserId;
    //get user data from db
    const user = await Admin.findOne({ _id: loggedInUserId });
    if (!user) {
      return res.status(400).send({ message: "No user found! Login first" });
    }
    //get user full name
    const fullName = `${user.firstName} ${user.lastName}`;

    // Generate the HTML content by calling the template function
    const htmlContent = passwordChangedEmail(fullName);

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

    try {
      //update password with newHashedPassword

      await Admin.updateOne(
        { _id: loggedInUserId },
        { $set: { password: newHashedPassword } }
      );

      //send email to user with the password changed information
      sendEmail(
        user.email,
        "Password Changed",
        "Password Changed Successfully",
        htmlContent
      );

      //send response
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

//!=============Student functions for admin user==================================

//?==========get student requests/list =================
router.post("/admin/profile/student-list", isAdmin, async (req, res) => {
  const studentList = await Student.aggregate([
    {
      $match: {},
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        mobile: 1,
        email: 1,
        class: 1,
        subjects: 1,
        timing: 1,
        city: 1,
        area: 1,
        status: 1,
      },
    },
  ]);

  //if no any students in the list, send message
  if (!studentList.length) {
    return res
      .status(200)
      .send({ message: "No any students have registered yet." });
  }
  return res
    .status(200)
    .send({ message: "Student List fetched", studentList: studentList });
});

//?==========update student status=========================
router.put(
  "/admin/profile/student-list/update-status/:id",
  isAdmin,
  validateMongoIdFromReqParams,
  async (req, res) => {
    //extract id from req.params.id
    const studentID = req.params.id;
    // console.log(studentID);
    //find student by id
    const student = await Student.findById(studentID);

    //if not student, throw error
    if (!student) {
      return res.status(404).send({ message: "Student does not exist" });
    }
    if (student.status === "Completed") {
      return res
        .status(200)
        .send({ message: "Student Status is already Updated." });
    }
    //update/edit student status

    await Student.updateOne(
      { _id: studentID },
      { $set: { status: "Completed" } }
    );

    //send response
    return res
      .status(200)
      .send({ message: "Student Status Updated Successfully" });
  }
);

//?==========delete student================================
router.delete(
  "/admin/profile/student/delete/:id",
  isAdmin,
  validateMongoIdFromReqParams,
  async (req, res) => {
    //extract id from req.params.id
    const studentID = req.params.id;

    //find student by id
    const student = await Student.findById(studentID);

    //if not student, throw error
    if (!student) {
      return res.status(404).send({ message: "Student does not exist" });
    }
    //delete student

    await Student.deleteOne({ _id: studentID });

    //send response
    return res
      .status(200)
      .send({ message: "One Student data deleted Successfully" });
  }
);

//!=============Tution functions for admin user===================================

//?==========get tution list(posts) =============================
router.post("/admin/profile/tution/list", isAdmin, async (req, res) => {
  const tuitionList = await Tution.aggregate([
    {
      $match: {},
    },
    {
      $lookup: {
        from: "teachers",
        localField: "teacherDetails",
        foreignField: "_id",
        as: "teacherDetails",
      },
    },
    {
      $unwind: "$teacherDetails",
    },
    {
      $addFields: {
        teacherName: {
          $concat: [
            "$teacherDetails.firstName",
            " ",
            "$teacherDetails.lastName",
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        forClass: 1,
        price: 1,
        priceType: 1,
        subjects: 1,
        status: 1,
        teacherName: 1, // { $first: `$teacherDetails.firstName` },
      },
    },
  ]);
  // console.log(typeof tuitionList);
  //if no any tuition in the list, send message
  if (!tuitionList.length) {
    return res
      .status(200)
      .send({ message: "No any tuition is registered yet." });
  }
  return res
    .status(200)
    .send({ message: "Tuition List fetched", tuitionList: tuitionList });
});

//?==========delete tution(posts) posted by teacher ===========================
router.delete(
  "/admin/profile/tution/delete/:id",
  isAdmin,
  validateMongoIdFromReqParams,
  async (req, res) => {
    //extract tution id from req.params
    const tutionID = req.params.id;
    //find tution in db using this tutionID
    const post = await Tution.findById(tutionID);
    //if no post,throw error
    if (!post) {
      return res.status(200).send({ message: "Tution post does not exist" });
    }
    //delete
    await Tution.deleteOne({ _id: tutionID });
    //send response
    res.status(200).send({ message: "One post has been removed successfully" });
  }
);

//?==========update status of tution(posts) posted by teacher ======================

router.put(
  "/admin/profile/tution/update/:id",
  isAdmin,
  validateMongoIdFromReqParams,
  async (req, res) => {
    //extract id from params
    const tutionID = req.params.id;
    //find tution post by this id
    const post = await Tution.findById(tutionID);
    //if not post found, throw error
    if (!post) {
      return res.status(400).send({ message: "No any tution post found" });
    }
    if (post.status === "Completed") {
      return res.status(200).send({ message: "Status is already updated" });
    }
    //update status
    try {
      await Tution.updateOne(
        { _id: tutionID },
        { $set: { status: "Completed" } }
      );
    } catch (error) {
      return res
        .status(400)
        .send({ message: "Something went wrong! Please Try again" });
    }

    //send response
    return res
      .status(200)
      .send({ message: "Tution Status Updated Successfully" });
  }
);

//!=============Teacher functions for admin user==================================

//?==========get teacher list =============================
router.get("/admin/profile/teacher-list", isAdmin, async (req, res) => {
  const teacherList = await Teacher.aggregate([
    {
      $match: {},
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        mobile: 1,
        email: 1,
        degree: 1,
        subjects: 1,
        level: 1,
        city: 1,
        area: 1,
      },
    },
  ]);

  //if no any teachers in the list, send message
  if (!teacherList.length) {
    return res
      .status(200)
      .send({ message: "No any teachers have registered yet." });
  }
  return res
    .status(200)
    .send({ message: "Teacher List fetched", teacherList: teacherList });
});

//?========== delete teacher ================================
router.delete(
  "/admin/profile/teacher/delete/:id",
  isAdmin,
  validateMongoIdFromReqParams,
  async (req, res) => {
    //extract id from req.params.id
    const teacherID = req.params.id;

    //find teacher by id
    const teacher = await Teacher.findById(teacherID);

    //if not teacher, throw error
    if (!teacher) {
      return res.status(404).send({ message: "teacher does not exist" });
    }
    //?=================to delete teacher data ======================
    // Step 1: Check if the teacher has any tution data
    const tutionExists = await Tution.findOne({
      teacherDetails: teacherID,
    });
    if (tutionExists) {
      return res.status(200).send({
        message: "Teacher has associated tution data. Cannot delete.",
      });
    }
    // Step 2: Delete the teacher if no tution data exists
    // if (!tutionExists) {

    //   const deleteResult = await Teacher.deleteOne({ _id: teacherID });
    // }

    //*==============================================
    //delete teacher,if no tution data exists

    await Teacher.deleteOne({ _id: teacherID });

    //send response
    return res
      .status(200)
      .send({ message: "Teacher Data deleted Successfully" });
  }
);

//!=============Contact Form functions for admin user==================================
//?=====================api to get all contact form data ==============
router.get("/contact-form/data", isAdmin, async (req, res) => {
  //db call to fetch form data
  const contactFormData = await ContactForm.aggregate([
    {
      $match: {},
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        mobileNo: 1,
        subject: 1,
        message: 1,
        status: 1,
      },
    },
  ]);
  //if no any data, send this response
  if (!contactFormData.length) {
    return res
      .status(200)
      .send({ message: "No any contact form data available." });
  }
  //send response with contact form data
  return res
    .status(200)
    .send({ message: "Success", contactFormData: contactFormData });
});

//?========== api to update contact form data status(by id) ==============

router.put(
  "/contact-form/data/update/:id",
  isAdmin,
  validateMongoIdFromReqParams,
  async (req, res) => {
    //extract contact form data id from params
    const formDataId = req.params.id;
    console.log(formDataId);
    // find form data with formDataId in db
    const contactFormData = await ContactForm.findOne({ _id: formDataId });
    console.log(contactFormData);
    // if no data found, send that response
    if (!contactFormData) {
      return res.status(200).send({ message: "No Data found" });
    }
    //check if status is already updated to "Completed"
    if (contactFormData.status === "Contacted") {
      return res
        .status(200)
        .send({ message: "Status is already updated to -Contacted-" });
    }
    //update status
    await ContactForm.updateOne(
      { _id: formDataId },
      { $set: { status: "Contacted" } }
    );

    //send response
    return res.status(200).send({ message: "Status Updating Success" });
  }
);

//?========== api to delete contact form data(by id) ==============

router.delete(
  "/contact-form/data/delete/:id",
  isAdmin,
  validateMongoIdFromReqParams,
  async (req, res) => {
    //extract contact form data id from params
    const formDataId = req.params.id;

    // find form data with formDataId in db
    const contactFormData = await ContactForm.findOne({ _id: formDataId });
    // if no data found, send that response
    if (!contactFormData) {
      return res.status(200).send({ message: "No Data found" });
    }
    //get user name
    const userName = `${contactFormData?.firstName} ${contactFormData?.lastName}`;
    console.log(userName);
    //delete data
    await ContactForm.deleteOne({ _id: formDataId });

    //send response
    return res
      .status(200)
      .send({ message: `${userName} data deleted Successfully` });
  }
);
//export router
export default router;
