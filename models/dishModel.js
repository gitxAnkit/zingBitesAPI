import mongoose from "mongoose";

const dishModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter dish name"]
    },
    description: {
        type: String,
        required: [true, "Enter description of dish"]
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot be more than 5"]
    },
    price: {
        type: Number,
        required: [true, "Enter food price!!"],
    },
    images: [{
        public_id: {
            type: String,
            // required: true,
        },
        url: {
            type: String,
            required: true,
        }
    }],
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurants",
        required: true,
    },


});

export default mongoose.model('Dishes', dishModel);