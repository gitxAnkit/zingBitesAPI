import express from 'express';
import { createDish, getDishes, updateDish, removeDish, getDishById, getDishesByRestaurant } from '../controllers/dishControllers.js';
import { authorizedRoles, isAuthenticatedUser } from '../middlewares/auth.js';

const router = express.Router();

router.route("/restaurant/:restaurantId/dishes")
    .post(isAuthenticatedUser, authorizedRoles("admin"), createDish)
    .get(isAuthenticatedUser, getDishesByRestaurant);
router.route("/dishes").get(getDishes);
router.route("/dish/:dishId")
    .get(getDishById)
    .delete(isAuthenticatedUser, authorizedRoles("admin"), removeDish)
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateDish);

export default router;