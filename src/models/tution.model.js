import mongoose from "mongoose";

const tutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    subjects: {
      type: [String],
      required: true,
      trim: true,
    },
    forClass: {
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
    price: {
      type: Number,
      maxlength: [5, "price must be of max 5 digits"],
      required: true,
    },
    priceType: {
      type: String,
      required: [true, "Price type hour/monthly required"],
      enum: ["hourly", "monthly"],
      default: "monthly",
    },
    teacherDetails: {
      type: mongoose.ObjectId,
      ref: "teachers",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Tution = new mongoose.model("Tution", tutionSchema);

export default Tution;
