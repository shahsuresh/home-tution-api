import { Router } from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import contactFormValidationSchema from "../validations/contactForm.validation.js";
import ContactForm from "../models/contactForm.model.js";

const router = Router();

router.post(
  "/visitor-data",
  validateReqBody(contactFormValidationSchema),
  async (req, res) => {
    //extract data from req.body
    const visitorData = req.body;
    try {
      // save the validated data data in database
      await ContactForm.create(visitorData);
      return res
        .status(200)
        .send({ message: "Your form is submitted successfully" });
    } catch (error) {
      return res
        .status(400)
        .send({ message: "Something goes wrong", error: error.message });
    }
  }
);

export default router;
