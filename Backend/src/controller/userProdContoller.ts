import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppDatasorce } from "../data-source";
import { ProductType } from "../entity/product-type";
import { Product } from "../entity/product";
import { log } from "node:console";
import { AppError } from "../utils/global-Error";

const typerepo = AppDatasorce.getRepository(ProductType)
const prodrepo = AppDatasorce.getRepository(Product)

export const getTaxonomy = catchAsync(async (req: Request, res: Response) => {

    try {
        const taxonomy = await typerepo.find({
            relations: ['categories', 'categories.subCategory']
        })

        res.json(taxonomy);
    }
    catch (err) {
        res.status(500).json({ message: "error loading categories" })
    }
}
)

export const searchProducts = catchAsync(async (req: Request, res: Response) => {

    try {
        const { query, subCategoryId, categoryId, typeId, minPrice, maxPrice } = req.query

        console.log(req.body,"this is body");
        
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        
        const qb = prodrepo.createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "subCategory")
            .leftJoinAndSelect("subCategory.category", "category")
            .leftJoinAndSelect("category.type", "type")

        if (query) {
            qb.andWhere("(product.name LIKE :q OR product.description LIKE :q)", { q: `%${query}%` });
        }

        if (subCategoryId) {
            qb.andWhere("subCategory.id =:subId", { subId: subCategoryId })
        }

        else if (categoryId) {
            qb.andWhere("category.id = :catId", { catId: categoryId })
        }

        else if (typeId) {
            qb.andWhere("type.id = :typeId", { typeId: typeId })
        }

        if (minPrice !== undefined) {
            qb.andWhere("product.price >= :min", { min: minPrice });
        }

        if (maxPrice) {
            qb.andWhere("product.price <= :max", { max: maxPrice })
        }

        qb.andWhere("product.Stockquantity > 0")


        qb.skip(skip).take(limit)

        const [products, total] = await qb.getManyAndCount();

        res.json({
            data: products,
            totalCount: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error roccured" })
    }
})

export const getSingleProdDetails = catchAsync(async (req: Request, res: Response) => {

    const id = Number(req.params.id)
    console.log(id);

    const prod = await prodrepo.findOne({
        where: { id },
        relations: ["category", "category.category", "category.category.type"]
    })
    if (!prod) {
        return res.status(404).json("no product found")
    }
    res.json(prod)

})

export const getAllproducts = catchAsync(async(req:Request, res:Response)=>{
    const allproducts = await prodrepo.find({relations:["category"]})

    res.json(allproducts)
})

