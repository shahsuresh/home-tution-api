import * as Yup from "yup";

const contactFormValidationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email format"),
  // .required("Email is required"),
  mobileNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  subject: Yup.string()
    .required("Subject is required")
    .max(150, "Subject must be at most 150 characters"),
  message: Yup.string().max(300, "message must be at most 300 characters"),
  status: Yup.string()
    .required()
    .oneOf(["Pending", "Contacted"])
    .default("Pending"),
});
export default contactFormValidationSchema;
