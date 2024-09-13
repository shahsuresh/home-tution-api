import { Router } from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import { studentDataValidationSchema } from "../validations/student.validation.js";
import Student from "../models/student.model.js";

const router = Router();

//?============ Students request for tution classes ============

router.post(
  "/student/request",
  validateReqBody(studentDataValidationSchema),
  async (req, res) => {
    //extract student data from req.body
    const studentData = req.body;
    //add validated student data to database collection
    try {
      await Student.create(studentData);
      //send response
      res
        .status(200)
        .send({
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
