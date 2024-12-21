import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users", // Reference to the Users collection
        required: true,
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurants", // Reference to the Restaurants collection
        required: true,
    },
    dishes: [
        {
            dish: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Dishes", // Reference to the Dishes collection
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity must be at least 1"],
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: [0, "Total price cannot be negative"],
    },
    deliveryAddress: {

        address: {
            type: String,
            required: [true, "Enter your address"],
            minLength: [8, "Address should contain at least 8 characters"],
        },
        location: {
            type: {
                type: String,
                enum: ["Point"], // GeoJSON type for location
                default: "Point",
            },
            coordinates: {
                type: [Number], // Array of [longitude, latitude]
                required: [true, "Enter location coordinates"],
            },
        },

    },
    status: {
        type: String,
        enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
        default: "Pending",
    },
    paymentMethod: {
        type: String,
        enum: ["Cash on Delivery", "Credit Card", "Debit Card", "UPI"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

orderSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model("Orders", orderSchema);
