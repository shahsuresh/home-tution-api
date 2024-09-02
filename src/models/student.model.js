import mongoose from "mongoose";
//?=======set rules===============
const studentSchema = new mongoose.Schema(
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
      required: false,
      maxlength: 65,
      trim: true,
      lowercase: true,
    },

    class: {
      type: String,
      required: true,
      enum: [
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
    },
    subjects: {
      type: [String],
      required: true,
    },
    timing: {
      type: String,
      required: true,
      enum: ["Morning", "Day", "Evening"],
      default: "Morning",
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
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Completed"],
    },
  },
  { timestamps: true }
);
//? ====create table/collection=====
const Student = new mongoose.model("Student", studentSchema);
//?====export collection===========
export default Student;
