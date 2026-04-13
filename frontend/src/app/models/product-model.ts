import { SubCategory } from "./taxonomy-model";

export interface product{
    id:number,
    name:string;
    description:string;
    price:number;
    Stockquantity:number;
    imagePath:string;
    category?:SubCategory
}

export interface FilterState {
  query?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  typeId?: number | null;
  categoryId?: number | null;
  subCategoryId?: number | null;
}