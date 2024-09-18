import mongoose from "mongoose";
//?=======set rules===============
const contactFormSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 35,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 35,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      maxlength: 65,
      trim: true,
      lowercase: true,
    },
    mobileNo: {
      type: Number,
      required: true,
      minlength: [10, "Mobile Number must be 10 digit"],
      maxlength: [10, "Mobile Number must be 10 digit"],
    },
    subject: {
      type: String,
      required: true,
      maxlength: [150, "Subject must be at most 150 characters"],
    },
    message: {
      type: String,
      required: false,
      maxlength: [300, "message must be at most 300 characters"],
    },
  },
  { timestamps: true }
);
//? ====create table/collection=====
const ContactForm = new mongoose.model("ContactForm", contactFormSchema);

//?====export collection===========
export default ContactForm;
