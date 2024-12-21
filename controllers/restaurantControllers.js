import Restaurant from "../models/restaurantModel.js";
import User from "../models/userModel.js";
import { ApiFeatures } from "../utils/apiFeatures.js";
import catchAsyncErrors from "../utils/catchAsyncErrors.js";

export const getAllRestaurants = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 10;
    const totalRestaurants = await Restaurant.countDocuments();

    const apiFeatures = new ApiFeatures(Restaurant.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const restaurants = await apiFeatures.query;

    res.status(200).json({
        success: true,
        totalRestaurants: totalRestaurants,
        count: restaurants.length,
        restaurants
    });
});

export const getRestaurantById = catchAsyncErrors(async (req, res, next) => {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404).json({
            success: false,
            message: "Restaurant not found!!"
        });
    }
    res.status(200).json({
        success: true,
        restaurant
    })
});

// @desc Get Nearby Restaurants
// GET /restaurants/nearby
export const getNearbyRestaurants = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id; // Assume `req.user` contains authenticated user data

    // Fetch the user and populate the defaultAddress
    const user = await User.findById(userId);
    if (!user || !user.defaultAddress) {
        return next(new ErrorHandler("Default address not set for the user", 400));
    }
    const { coordinates } = user.defaultAddress.location;
    const maxDistanceInMeters = 5000; // Set the radius, e.g., 5 km

    // Find nearby restaurants using the default address coordinates
    const restaurants = await Restaurant.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates }, // Use user's default address coordinates
                distanceField: "distance",
                maxDistance: maxDistanceInMeters,
                spherical: true,
            },
        },
    ]);

    res.status(200).json({
        success: true,
        restaurants,
    });
});
export const updateRestaurant = catchAsyncErrors(async (req, res, next) => {
    const { restaurantId } = req.params;

    let restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404).json({
            success: false,
            message: "Restaurant not found!!"
        });
    }
    restaurant = await Restaurant.findByIdAndUpdate(restaurantId, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        restaurant
    })

});


// --Admin
export const addRestaurant = catchAsyncErrors(async (req, res, next) => {
    const { name, address, latitude, longitude, rating } = req.body;

    if (!latitude || !longitude) {
        return next(new ErrorHandler("Coordinates (latitude and longitude) are required.", 400));
    }

    const restaurant = await Restaurant.create({
        name,
        address,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
        rating: rating || 0,
    });

    res.status(201).json({
        success: true,
        restaurant
    });
});
// --admin
export const deleteRestaurant = catchAsyncErrors(async (req, res, next) => {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        return res.status(404).json({
            success: false,
            message: "Restaurant not found!!"
        });
    }
    await Restaurant.findByIdAndDelete(restaurantId);
    res.status(200).json({
        success: true,
        message: "Restaurant removed successfully!!"
    })

})