import catchAsyncErrors from "../utils/catchAsyncErrors.js"
import Order from "../models/orderModel.js";
import Dish from "../models/dishModel.js";
import User from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";

// POST /orders
export const createOrder = catchAsyncErrors(async (req, res, next) => {
    const { restaurant, dishes, paymentMethod } = req.body;

    // Validate required fields
    if (!restaurant || !dishes || !paymentMethod) {
        return next(new ErrorHandler("All fields are required.", 400));
    }

    // Retrieve user and ensure delivery address exists
    const user = await User.findById(req.user.id);
    if (!user || !user.defaultAddress || !user.defaultAddress.address) {
        return next(new ErrorHandler("Delivery address not found for the user.", 404));
    }
    const deliveryAddress = user.defaultAddress;

    // Calculate total price (use for...of instead of reduce for async calls)
    let totalPrice = 0;
    for (const item of dishes) {
        const dish = await Dish.findById(item.dish);
        if (!dish) {
            return next(new ErrorHandler(`Dish with ID ${item.dish} not found.`, 404));
        }
        totalPrice += dish.price * item.quantity;
    }

    // Create the order
    const order = await Order.create({
        user: user.id,
        restaurant,
        dishes,
        deliveryAddress,
        totalPrice,
        paymentMethod,
    });

    // Send response
    res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        order,
    });
});

// GET /orders
export const getUserOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })
        .populate("restaurant")
        .populate("dishes.dish");

    res.status(200).json({
        success: true,
        orders,
    });
});

// GET /orders/:orderId
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
        .populate("restaurant")
        .populate("dishes.dish");
    if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// PUT /orders/:orderId
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
    }

    if (!["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"].includes(status)) {
        return next(new ErrorHandler("Invalid status.", 400));
    }

    order.status = status;
    await order.save();

    res.status(200).json({
        success: true,
        message: "Order status updated.",
        order,
    });
});

// DELETE /orders/:orderId
export const cancelOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        return next(new ErrorHandler("Order not found.", 404));
    }

    if (order.user.toString() !== req.user.id.toString()) {
        return next(new ErrorHandler("You cannot cancel someone else's order.", 403));
    }

    if (order.status !== "Pending") {
        return next(new ErrorHandler("Only pending orders can be cancelled.", 400));
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
        success: true,
        message: "Order cancelled successfully.",
    });
});
