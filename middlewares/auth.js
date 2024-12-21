import User from "../models/userModel.js";
import catchAsyncErrors from "../utils/catchAsyncErrors.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
// import dotenv from 'dotenv';
// dotenv.config({ path: '../config/.env' });

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);

    next();
});

export const authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource `,
                    403
                )
            );
        }
        next();
    }
}