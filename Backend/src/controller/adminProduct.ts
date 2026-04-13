import { Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { AppDatasorce } from "../data-source"
import { Product } from "../entity/product"
import { AppError } from "../utils/global-Error"
import path from "path"
import fs from "fs"
import { Category } from "../entity/Category"
const prodRepo = AppDatasorce.getRepository(Product)
const cateRepo = AppDatasorce.getRepository(Category)

export const addProduct = catchAsync(async (req: Request, res: Response) => {
    const { name, description, price, Stockquantity, subcategoryId } = req.body

    const subCategory = await cateRepo.findOne({where:{id:subcategoryId}})
    const imagePath = req.file ? `/productImages/${req.file.filename}` : null

    const data = await prodRepo.create({
        name,
        description,
        price: parseFloat(price),
        Stockquantity: parseInt(Stockquantity),
        category: subCategory,
        imagePath
    })

    await prodRepo.save(data)

    res.status(201).json({
        status: "success",
        data
    })
})

export const deleteProd = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params

    const prod = await prodRepo.findOneBy({ id: parseInt(id as string) })

    if (!prod) {
        throw res.status(404).json("product not found")
    }

    if (prod?.imagePath) {
        const fullpath = path.join(__dirname, '../..', prod.imagePath);
        if (fs.existsSync(fullpath)) {
            fs.unlinkSync(fullpath)
        }
    }

    await prodRepo.delete(id)
    await prodRepo.save


    res.status(201).json({
        status: "deleted sucessfully",
    })

})

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const updated = req.body

    const prod = await prodRepo.findOneBy({ id: parseInt(id as string) })

    if (!prod) {
        throw res.json("product not found")
    }

    if (req.body.categoryId) {
        const categoryExists = await cateRepo.findOneBy({ id: req.body.categoryId });
        if (!categoryExists) {
            return res.json({ message: "The Category ID you provided does not exist." });
        }
    }
    // update feilds
    Object.assign(prod,updated)

    // Manually handle the category relation if it's in the body
    if (req.body.categoryId) {
        // This tells TypeORM to link the product to a specific category ID
        prod.category = req.body.categoryId;
    }

    //if new image uploded delete the first one 
    if (req.file) {
        if (prod.imagePath) {
            const oldpath = path.join(__dirname, '../..', prod.imagePath)
            if (fs.existsSync(oldpath)) fs.unlinkSync(oldpath);
        }

        prod.imagePath = `/productImages/${req.file.filename}`
    }
    await prodRepo.save(prod)
    res.json(prod)
})