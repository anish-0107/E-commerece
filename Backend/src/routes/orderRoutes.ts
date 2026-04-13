import { Router } from "express";
import { Allorders, getOrderDeatils, getOrderHistory, placeOrder } from "../controller/orderController";
import { authorise } from "../middleware/AuthMiddleware";

const orderRoutes = Router()

orderRoutes.get('/history',authorise(['user']),getOrderHistory)
orderRoutes.get("/details/:orderId",getOrderDeatils)
orderRoutes.post("/place",authorise(['user']), placeOrder)
orderRoutes.get('/allOrders', authorise(['admin']), Allorders)

export default orderRoutes