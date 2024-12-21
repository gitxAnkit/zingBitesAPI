import { ErrorHandler } from "../utils/errorHandler.js";

const error = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error."

    //Mongodb error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 404);
    }

    //Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong jwt error
    if (err.name == "JsonWebTokenError") {
        const message = `Json Web Token is invalid, try again.`;
        err = new ErrorHandler(message, 400);
    }
    //  JWT expire error
    if (err.name == "TokenExpired Error") {
        const message = `Json Web Token is expired, try again.`;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,

    });
}
export default error;