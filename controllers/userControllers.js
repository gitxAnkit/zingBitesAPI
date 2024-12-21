import catchAsyncErrors from "../utils/catchAsyncErrors.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import cloudinary from "../config/cloudinary.js";

// @desc Register New User
// POST /auth/register 
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;
    // Correct avatar, after making frontend

    let userAvatar = { public_id: null, url: null };
    if (avatar) {
        try {
            const uploadResult = await cloudinary.uploader.upload(avatar, {
                folder: "zing-bites/users",
                crop: "scale",
                width: 150,
            });
            userAvatar = {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url,
            };
        } catch (error) {
            return next(new ErrorHandler("Avatar upload failed", 500));
        }
    }

    const user = await User.create({
        name, email, password,
        avatar: userAvatar
    });
    sendToken(user, 201, res);
});

// @desc Login User
// POST /login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return new ErrorHandler("Please enter email or password.", 400);
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return new ErrorHandler("Invalid email or password", 401);
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password.", 401));
    }
    sendToken(user, 200, res);
})
// @desc Update addresses
// PUT /addresses
export const updateAddress = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }
    const { address, coordinates } = req.body;
    // Ensure coordinates are provided in the correct format: [longitude, latitude]
    if (!coordinates || coordinates.length !== 2) {
        return next(new ErrorHandler("Invalid coordinates format", 400));
    }
    const newAddress = {
        address,
        location: {
            type: "Point",
            coordinates: [coordinates[1], coordinates[0]] // Coordinates: [longitude, latitude]
        }
    }
    user.addresses.push(newAddress);
    await user.save();
    res.status(200).json({
        success: true,
        message: "Address updated successfully!"
    })
})

// @desc Remove address
// DELETE /addresses
export const removeAddress = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const { addressId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }
    await User.updateOne(
        { _id: userId },
        { $pull: { addresses: { _id: addressId } } }
    );

    res.status(200).json({
        success: true,
        message: "Address removed successfully!"
    });
})
// @desc Set default address
// PUT /addresses/default/:addressId
export const setDefaultAddress = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const addressId = req.params.addressId;
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }
    const address = user.addresses.find(
        (addr) => addr._id.toString() === addressId
    );
    user.defaultAddress = address;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Default address set successfully!",
    });
});
// @desc Get User Details
// GET /profile
export const userDetails = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user
    })
})
// @desc Callback func for google authentication 
export const googleAuthCallback = catchAsyncErrors(async (req, res, next) => {
    const user = req.user; // Retrieved by Passport

    if (!user) {
        return next(new ErrorHandler("Auhtentication failed", 400));
    }

    // Send the token and user data
    sendToken(user, 200, res);
});
// @desc Logout User
// GET /logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully!!"
    });

})
// @desc Get all users
// GET /admin/users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const user = await User.find();

    res.status(200).json({
        success: true,
        user
    })
});

// @desc Remove user
// DELETE /admin/user/:userId
export const removeUser = catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({
        success: true,
        message: "User removed successfully!"
    });
})