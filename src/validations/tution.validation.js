import Yup from "yup";

export const tutionPostValidationSchema = Yup.object({
  name: Yup.string()
    .required("Tution Name is required")
    .trim()
    .max(50, "Tution Name must be at max 50 characters."),
  subjects: Yup.string().trim().required("Subject is required."),

  forClass: Yup.string()
    .required("For which class of student you want to teach?")
    .oneOf(
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "Bachelor",
      ],
      "Class must be from 1 to 12 and Bachelor"
    ),

  price: Yup.number("Must be positive Integer")
    .required("Price is required")
    .positive("Must be a positive Number"),
  priceType: Yup.string()
    .required("Price type is Required")
    .oneOf(["hourly", "monthly"])
    .default("monthly"),
  teacherDetails: Yup.string(),
});
