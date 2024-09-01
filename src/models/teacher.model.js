import mongoose from "mongoose";
//?=======set rules===============
const teacherSchema = new mongoose.Schema(
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
    mobile: {
      type: Number,
      required: true,
      minlength: [10, "Mobile Number must be 10 digit"],
      maxlength: [10, "Mobile Number must be 10 digit"],
    },
    email: {
      type: String,
      required: true,
      maxlength: 65,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      enum: ["+2", "Bachelor", "Master", "PHD"],
    },
    subjects: {
      type: [String],
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["SEE", "+2", "Bachelor"],
      default: "SEE",
    },

    city: {
      type: String,
      required: [true, "City name is required"],
      default: "Kathmandu",
      maxlength: [60, "City Name must be of max 60 characters"],
    },
    area: {
      type: String,
      required: [true, "Area name is required"],
      default: "Koteshwor",
      maxlength: [100, "Area Name must be of max 100 characters"],
    },
  },
  { timestamps: true }
);
//? ====create table/collection=====
const Teacher = new mongoose.model("Teacher", teacherSchema);
//?====export collection===========
export default Teacher;
