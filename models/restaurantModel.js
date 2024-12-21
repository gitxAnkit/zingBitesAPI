import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter restaurant name."]
    },
    address: {
        type: String,
        required: [true, "Enter restaurant address"],
        minLength: [8, "Address should contain atleast 8 characters"]
    },
    location: {
        type: {
            type: String, // GeoJSON type
            enum: ["Point"], // Only allow "Point"
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            required: true
        }
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot be more than 5"]
    },
    addedOn: {
        type: Date,
        default: Date.now,
    }
})
// Geospatial index for the `location` field
restaurantSchema.index({ location: "2dsphere" });

export default mongoose.model('Restaurants', restaurantSchema);