import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
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
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "adminRolePending"],
      default: "adminRolePending",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
