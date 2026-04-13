import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/global-Error";
import { AppDatasorce } from "../data-source";
import { ProductType } from "../entity/product-type";
import { Category } from "../entity/Category";
import { SubCategory } from "../entity/Sub-CAtegory";
import { Product } from "../entity/product";

const typerepo = AppDatasorce.getRepository(ProductType)
const cateRepo= AppDatasorce.getRepository(Category)
const subCateRepo = AppDatasorce.getRepository(SubCategory)

export const addType = catchAsync(async (req: Request, res: Response) => {
    const {type} = req.body

    const finalName = typeof type === 'object' ? type.type : type;

    if (!type) {
        throw res.json("enter name of type")
    }

    const data = typerepo.create({
        name: finalName
    })

    await typerepo.save(data)

    res.status(201).json({
        status: "success",
        data
    })

})


export const addCategory = catchAsync(async(req:Request,res:Response)=>{
    const caterepo = AppDatasorce.getRepository(Category)

    const {category,typeId} =req.body

    if(!category){
        throw res.json("enter the category")
    }

    const data = caterepo.create({
        name:category,
        type:{id:typeId}
    })

    await caterepo.save(data)

     res.status(201).json({
        status: "success",
        data
    })
})

export const addSubcategory = catchAsync(async(req:Request,res:Response)=>{

    const subcateRepo  = AppDatasorce.getRepository(SubCategory)
    const {name,categoryId} = req.body

    const data = subcateRepo.create({
        name,
        category:{id:categoryId}
    })

    await subcateRepo.save(data)

     res.status(201).json({
        status: "success",
        data
    })

})

export const removeType = catchAsync(async(req:Request,res:Response)=>{

    const id = Number(req.params.id)
    console.log(id);
    

    const getType = await typerepo.findOne({where:{id:id}, relations:['categories']})

    if(!getType){
        res.json({message:"no type found with this id"})
    }

    if(getType.categories && getType.categories.length > 1){
        res.json({message:'categories with this tye exits , first deltem them'})
    }

    await typerepo.remove(getType)
    res.json({
        message:'type deleted successfully'
    })
})

export const getAllType = catchAsync(async(req:Request, res:Response)=>{
    const alltypes = await typerepo.find()

    res.json({alltypes})
})

export const getAllCategories = catchAsync(async(req:Request, res:Response)=>{
    const alltypes = await cateRepo.find()

    res.json({alltypes})
})

export const getAllSubCate = catchAsync(async(req:Request, res:Response)=>{
    const alltypes = await subCateRepo.find()

    res.json({alltypes})
})
