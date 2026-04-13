import { Router } from "express";
import { addCategory, addSubcategory, addType, getAllCategories, getAllSubCate, getAllType, removeType } from "../controller/admin-taxonamy";
import { authorise } from "../middleware/AuthMiddleware";

const taxonamyRoutes = Router()

taxonamyRoutes.post("/addType",authorise(['admin']),addType)
taxonamyRoutes.post("/addCategory",authorise(['admin']), addCategory)
taxonamyRoutes.post("/addSubCate",authorise(['admin']), addSubcategory)
taxonamyRoutes.delete('/delete/:id',authorise(['admin']),removeType)
taxonamyRoutes.get('/allTypes',authorise(['admin']), getAllType)
taxonamyRoutes.get('/allCategories',authorise(['admin']), getAllCategories)
taxonamyRoutes.get('/allSubCate',authorise(['admin']), getAllSubCate)


export default taxonamyRoutes;

