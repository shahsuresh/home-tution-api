import { Router } from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import { studentDataValidationSchema } from "../validations/student.validation.js";
import Student from "../models/student.model.js";
import sendEmail from "../services/email.js";
import { studentRegistrationSuccessEmail } from "../services/emailTemplate.js";

const router = Router();

//?============ Students request for tution classes ============

router.post(
  "/student/request",
  validateReqBody(studentDataValidationSchema),
  async (req, res) => {
    //extract student data from req.body
    const studentData = req.body;

    //get student full name from first and last name
    const studentName = `${studentData.firstName} ${studentData.lastName}`;

    // Generate the HTML content by calling the template function
    const htmlContent = studentRegistrationSuccessEmail(studentName);

    //add validated student data to database collection
    try {
      await Student.create(studentData);

      //send email
      sendEmail(
        studentData.email,
        "Tution Request",
        "Tution Request Submitted",
        htmlContent
      );

      //send response
      res.status(200).send({
        message:
          "Your request has been submitted successfully. We Will get back to you soon.",
      });
    } catch (error) {
      res.status(400).send({
        message:
          "Something went wrong during your request processing. Please try again.",
        error: error.message,
      });
    }
  }
);

export default router;
