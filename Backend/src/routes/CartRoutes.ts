import { Router } from "express";
import { addToCart, clearCart, getCart, getCartTotal, removeItem, updateCartQuantity } from "../controller/CartController";
import { authorise } from "../middleware/AuthMiddleware";

const CartRoutes = Router()

CartRoutes.get("/get",authorise(['user']),getCart)
CartRoutes.post("/add", authorise(['user']),addToCart)
CartRoutes.post('/update',authorise(['user']),updateCartQuantity)
CartRoutes.get('/clear',authorise(['user']),clearCart)
CartRoutes.get('/cartTotal',authorise(['user']),getCartTotal)
CartRoutes.delete("/delete/:id", authorise(['user']),removeItem)

export default  CartRoutes