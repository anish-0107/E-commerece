import { Router } from "express";
import { addProduct, deleteProd, updateProduct } from "../controller/adminProduct";
import { upload } from "../middleware/uploadMiddleware";
import { authorise } from "../middleware/AuthMiddleware";
import { getAllproducts, getSingleProdDetails, getTaxonomy, searchProducts } from "../controller/userProdContoller";

const prodRoutes = Router()

// routes fpor admin only
prodRoutes.post("/add",authorise(['admin']),upload.single('imagePath'),addProduct)
prodRoutes.patch("/update/:id",authorise(["admin"]),updateProduct)
prodRoutes.delete("/delete/:id", authorise(['admin']),deleteProd)


// routes for guest and user only
prodRoutes.get("/types",getTaxonomy)
prodRoutes.get("/allproducts", getAllproducts)
prodRoutes.get("/search", searchProducts)
prodRoutes.get("/getsingle/:id", getSingleProdDetails)


export default prodRoutes