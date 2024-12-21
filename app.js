import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import expressSession from 'express-session';
import errorMiddleware from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { connectDB } from './config/mongoConnection.js';
import passportMiddleware from './config/passport.js';

// Route imports
import restaurantRoutes from './routes/restaurantRoutes.js';
import dishesRoutes from './routes/dishRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
const app = express();

// Database connection
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }
}));
app.use(fileUpload());
app.use(passportMiddleware.initialize());
app.use(passportMiddleware.session());


// Routes
app.use("/api/v1", restaurantRoutes);
app.use("/api/v1", dishesRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);

// Error middleware
app.use(errorMiddleware);

export default app;