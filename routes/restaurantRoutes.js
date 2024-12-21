import express from 'express';
import { addRestaurant, deleteRestaurant, updateRestaurant, getAllRestaurants, getRestaurantById, getNearbyRestaurants } from '../controllers/restaurantControllers.js';
import { authorizedRoles, isAuthenticatedUser } from '../middlewares/auth.js';

const router = express.Router();

router.route("/restaurants")
    .get(getAllRestaurants);
router.route("/restaurant")
    .post(isAuthenticatedUser, authorizedRoles("admin"), addRestaurant);

router.route("/restaurant/nearby").get(isAuthenticatedUser, getNearbyRestaurants);
router.route("/restaurant/:restaurantId")
    .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteRestaurant)
    .get(isAuthenticatedUser, authorizedRoles("admin"), getRestaurantById)
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateRestaurant);


export default router;