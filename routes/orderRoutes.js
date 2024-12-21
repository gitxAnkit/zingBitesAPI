import {
    createOrder, getUserOrders,
    getOrderDetails, updateOrderStatus, cancelOrder
} from "../controllers/orderControllers.js";
import express from 'express';
import { authorizedRoles, isAuthenticatedUser } from '../middlewares/auth.js';

const router = express.Router();

router.route("/orders")
    .post(isAuthenticatedUser, createOrder)
    .get(isAuthenticatedUser, getUserOrders);

router.route("/orders/:orderId")
    .get(isAuthenticatedUser, getOrderDetails)
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateOrderStatus)
    .delete(isAuthenticatedUser, cancelOrder);
export default router;