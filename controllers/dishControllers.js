import Dishes from '../models/dishModel.js';
import Restaurant from '../models/restaurantModel.js';
import { ApiFeatures } from '../utils/apiFeatures.js';
import catchAsyncErrors from '../utils/catchAsyncErrors.js';
import { ErrorHandler } from '../utils/errorHandler.js';

// @desc Get All dishes
export const getDishes = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 10;
    const totalDishesCount = await Dishes.countDocuments();

    const apiFeatures = new ApiFeatures(Dishes.find().populate("restaurant"), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const dishes = await apiFeatures.query;

    res.status(200).json({
        success: true,
        totalDishesCount,
        resultPerPage,
        count: dishes.length,
        dishes
    });
});

// @desc Add new dish
export const createDish = catchAsyncErrors(async (req, res, next) => {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        return next(new ErrorHandler("Restaurant not found.", 404));
    }
    const { name, price } = req.body;
    if (!name || !price) {
        return next(new ErrorHandler("Dish name and price is required.", 400));
    }
    const dish = await Dishes.create({
        ...req.body,
        restaurant: restaurantId,
    });
    res.status(201).json({
        success: true,
        message: "Dish added succesfully!!",
        dish
    })
});

//@desc Remove a dsih
export const removeDish = catchAsyncErrors(async (req, res, next) => {
    const { dishId } = req.params;
    const dish = Dishes.findById(dishId);
    if (!dish) {
        return next(new ErrorHandler("Dish not found", 404));
    }
    await Dishes.findByIdAndDelete(dishId);
    res.status(200).json({
        success: true,
        message: "Dish removed successfully!!"
    })
});
//@desc Get a dsih
export const getDishById = catchAsyncErrors(async (req, res, next) => {
    const { dishId } = req.params;
    const dish = await Dishes.findById(dishId).populate("restaurant");
    if (!dish) {
        return next(new ErrorHandler("Dish not found", 404));
    }
    res.status(200).json({
        success: true,
        dish
    })
});
// @desc Update a dish
export const updateDish = catchAsyncErrors(async (req, res, next) => {
    const { dishId } = req.params;
    let dish = await Dishes.findById(dishId);
    if (!dish) {
        return next(new ErrorHandler("Dish not found.", 404));
    }
    dish = await Dishes.findByIdAndUpdate(dishId, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        message: "Dish Updated successfully!!",
        dish
    });
});
// @desc Get all dishes of a restaurant
export const getDishesByRestaurant = catchAsyncErrors(async (req, res, next) => {
    const { restaurantId } = req.params;
    const dishes = await Dishes.find({ restaurant: restaurantId }).populate("restaurant");
    if (!dishes) {
        return next(new ErrorHandler("No dishes found.", 404));
    }
    res.status(200).json({
        success: true,
        dishes
    });

})