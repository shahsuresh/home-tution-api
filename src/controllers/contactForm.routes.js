import { Router } from "express";
import validateReqBody from "../middlewares/validation.middleware.js";
import contactFormValidationSchema from "../validations/contactForm.validation.js";
import ContactForm from "../models/contactForm.model.js";
import sendEmail from "../services/email.js";
import { contactUsReplyEmail } from "../services/emailTemplate.js";

const router = Router();

router.post(
  "/visitor-data",
  validateReqBody(contactFormValidationSchema),
  async (req, res) => {
    //extract data from req.body

    const visitorData = req.body;

    // get full name and message of the visitor

    const userName = `${visitorData.firstName} ${visitorData.lastName}`;
    const inquiryMessage = visitorData.message;

    // Generate the HTML content by calling the template function
    const htmlContent = contactUsReplyEmail(userName, inquiryMessage);

    try {
      // save the validated data data in database

      await ContactForm.create(visitorData);

      // Send email with HTML content to visitor

      sendEmail(
        visitorData.email,
        "Welcome to One to One Tuition",
        "Thank you for registering with us. We will get back to you soon.",
        htmlContent
      );

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
