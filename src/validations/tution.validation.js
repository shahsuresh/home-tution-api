import Yup from "yup";

export const tutionPostValidationSchema = Yup.object({
  name: Yup.string()
    .required("Tution Name is required")
    .trim()
    .max(50, "Tution Name must be at max 50 characters."),
  subjects: Yup.array()
    .of(Yup.string().required("Each subject must be a string"))
    .min(1, "There must be at least one subject")
    .max(5, "There must be at most five subjects")
    .required("Subject is required"),

  forClass: Yup.string()
    .required("For which class of student you want to teach?")
    .oneOf(
      [
        "Primary",
        "Lower Secondary",
        "Secondary",
        "+2-11th",
        "+2-12th",
        "Bachelor",
      ],
      "Class must be from Primary,Lower Secondary,Secondary, +2-11th,+2-12th and Bachelor"
    ),

  price: Yup.number("Must be positive Integer")
    .required("Price is required")
    .positive("Must be a positive Number"),
  priceType: Yup.string()
    .required("Price type is Required")
    .oneOf(["hourly", "monthly"])
    .default("monthly"),
  teacherDetails: Yup.string(),
  status: Yup.string()
    .required("Status is required")
    .default("Pending")
    .oneOf(["Pending", "Completed"]),
});
