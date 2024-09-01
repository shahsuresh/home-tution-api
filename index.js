import express from "express";
import cors from "cors";
import connectDB from "./src/db/connectDB.js";
import teacherRoutes from "./src/controllers/teacher.routes.js";

const app = express();
//? ==to make app understand json===
app.use(express.json());

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
//?===server and PORT======
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at:http://localhost:${PORT}/`);
});
