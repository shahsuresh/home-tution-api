import express from "express";
import cors from "cors";
import connectDB from "./src/db/connectDB.js";
import teacherRoutes from "./src/controllers/teacher.routes.js";
import studentRoutes from "./src/controllers/student.routes.js";
import adminRoutes from "./src/controllers/admin.routes.js";
import contactFormRoutes from "./src/controllers/contactForm.routes.js";

const app = express();
//? ==to make app understand json===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//?=== enable cors===

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//?======database connection======
connectDB();
//?=====register routes======
app.use(teacherRoutes);
app.use(studentRoutes);
app.use(adminRoutes);
app.use(contactFormRoutes);
//?===server and PORT======
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at:http://localhost:${PORT}/`);
});
