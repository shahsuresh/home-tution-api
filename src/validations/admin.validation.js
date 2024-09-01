import Yup from "yup";

//?========admin registration data validation=======================
export const adminDataValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .trim()
    .max(35, "First name must be at max 35 characters."),
  lastName: Yup.string()
    .max(35, "Last name must be at max 35 characters.")
    .trim()
    .required("Last name is required."),
  mobile: Yup.string().matches(
    /^\d{10}$/,
    "Mobile number must be exactly 10 digits"
  ),

  email: Yup.string()
    .email("Must be a valid email.")
    .required("Email is required")
    .trim()
    .max(65, "Email must be at max 65 characters.")
    .lowercase(),

  password: Yup.string()
    .required("Password Required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long...")
    .trim(),
});

//?==============admin login data validation=========================
export const adminLoginDataValidationSchema = Yup.object({
  email: Yup.string()
    .email("Must be a valid email.")
    .required("Email is required")
    .trim()
    .max(65, "Email must be at max 65 characters.")
    .lowercase(),
  password: Yup.string()
    .required("Password Required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long...")
    .trim(),
});

//?==============update admin data(profile) validation================

export const updateAdminProfileValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .trim()
    .max(35, "First name must be at max 35 characters."),
  lastName: Yup.string()
    .max(35, "Last name must be at max 35 characters.")
    .trim()
    .required("Last name is required."),
  mobile: Yup.string().matches(
    /^\d{10}$/,
    "Mobile number must be exactly 10 digits"
  ),

  email: Yup.string()
    .email("Must be a valid email.")
    .required("Email is required")
    .trim()
    .max(65, "Email must be at max 65 characters.")
    .lowercase(),
});
