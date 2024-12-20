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
  // origin: "*",
  origin: process.env.front_end_URL, // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], //allowed methods
  credentials: true, // Include credentials (cookies, authorization headers, etc.)
  allowedHeaders: ["Content-Type", "Authorization"],
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

// Define a route for the root URL: just to show message about app running or not
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

app.listen(PORT, () => {
  console.log(`Server is running at:http://localhost:${PORT}/`);
});
