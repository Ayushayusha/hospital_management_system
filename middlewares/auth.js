// import { User } from "../models/userSchema.js";
// import { catchAsyncErrors } from "./catchAsyncErrors.js";
// import ErrorHandler from "./error.js";
// import jwt from "jsonwebtoken";

// // Middleware to authenticate dashboard users
// export const isAdminAuthenticated = catchAsyncErrors(
//   async (req, res, next) => {
//     const token = req.cookies.adminToken;
//     if (!token) {
//       return next(
//         new ErrorHandler("Dashboard User is not authenticated!", 400)
//       );
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);
//     if (req.user.role !== "Admin") {
//       return next(
//         new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
//       );
//     }
//     next();
//   }
// );

// // Middleware to authenticate frontend users
// export const isPatientAuthenticated = catchAsyncErrors(
//   async (req, res, next) => {
//     const token = req.cookies.patientToken;
//     if (!token) {
//       return next(new ErrorHandler("User is not authenticated!", 400));
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);
//     if (req.user.role !== "Patient") {
//       return next(
//         new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
//       );
//     }
//     next();
//   }
// );

// export const isAuthorized = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(
//           `${req.user.role} not allowed to access this resource!`
//         )
//       );
//     }
//     next();
//   };
// };

import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate dashboard users
export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;

  // Check if token exists
  if (!token) {
    return next(new ErrorHandler("Dashboard User is not authenticated!", 400));
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch user from the database
    req.user = await User.findById(decoded.id);

    // Check if user exists
    if (!req.user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    // Verify user role
    if (req.user.role !== "Admin") {
      return next(
        new ErrorHandler(
          `${req.user.role} is not authorized for this resource!`,
          403
        )
      );
    }

    // User is authenticated
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token!", 400));
  }
});

// Middleware to authenticate frontend users
export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.patientToken;

  // Check if token exists
  if (!token) {
    return next(new ErrorHandler("User is not authenticated!", 400));
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Fetch user from the database
    req.user = await User.findById(decoded.id);

    // Check if user exists
    if (!req.user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    // Verify user role
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(
          `${req.user.role} is not authorized for this resource!`,
          403
        )
      );
    }

    // User is authenticated
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token!", 400));
  }
});

// Middleware to check user authorization
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    // Check if user's role matches the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} is not allowed to access this resource!`,
          403
        )
      );
    }
    next();
  };
};

