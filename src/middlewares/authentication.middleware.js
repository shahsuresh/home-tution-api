import jwt from "jsonwebtoken";
import Teacher from "../models/teacher.model.js";

//?==========teacher authentication================================

export const isTeacher = async (req, res, next) => {
  //    extract authorization from req.headers
  const authorization = req?.headers?.authorization;

  // extract token from authorization
  const splittedValues = authorization?.split(" ");

  const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;

  // if not token ,throw error
  if (!token) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  let payload;
  try {
    // verify token
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SIGNATURE);
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // find teacher by email from payload
  const teacher = await Teacher.findOne({ email: payload.email });

  // if not teacher
  if (!teacher) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  //   add teacherID to req
  req.loggedInUserId = teacher._id;

  // call next function
  next();
};

//?==========Buyer authentication================================
// export const isBuyer = async (req, res, next) => {
//   //    extract authorization from req.headers
//   const authorization = req?.headers?.authorization;

//   // extract token from authorization
//   const splittedValues = authorization?.split(" ");

//   const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;

//   // if not token ,throw error
//   if (!token) {
//     return res.status(401).send({ message: "Unauthorized." });
//   }

//   let payload;
//   try {
//     // verify token
//     payload = jwt.verify(token, process.env.ACCESS_TOKEN_SIGNATURE);
//   } catch (error) {
//     return res.status(401).send({ message: "Unauthorized." });
//   }

//   // find user by email from payload
//   const user = await User.findOne({ email: payload.email });

//   // if not user
//   if (!user) {
//     return res.status(401).send({ message: "Unauthorized." });
//   }

//   //    user role must be seller
//   if (user.role !== "buyer") {
//     return res.status(401).send({ message: "Unauthorized." });
//   }

//   //   add buyer id to req
//   req.loggedInUserId = user._id;

//   // call next function
//   next();
// };

//?==========User authentication================================
// export const isUser = async (req, res, next) => {
//   //    extract authorization from req.headers
//   const authorization = req?.headers?.authorization;

//   // extract token from authorization
//   const splittedValues = authorization?.split(" ");

//   const token = splittedValues?.length === 2 ? splittedValues[1] : undefined;

//   // if not token ,throw error
//   if (!token) {
//     return res.status(401).send({ message: "Unauthorized." });
//   }

//   let payload;
//   try {
//     // verify token
//     payload = jwt.verify(token, process.env.ACCESS_TOKEN_SIGNATURE);
//   } catch (error) {
//     return res.status(401).send({ message: "Unauthorized." });
//   }

//   // find user by email from payload
//   const user = await User.findOne({ email: payload.email });

//   // if not user
//   if (!user) {
//     return res.status(401).send({ message: "Unauthorized." });
//   }

//   //   add logged in user id to req
//   req.loggedInUserId = user._id;

//   // call next function
//   next();
// };
