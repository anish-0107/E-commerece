export interface Product{
    id:number;
    name:string;
    categories:Category[]
}

export interface Category{
    id:number;
    name:string;
    typeId?:number;
    subCategory:SubCategory[]

}
export interface SubCategory{
    id:number;
    name:string;
    categoryId?:number
}

export interface type{
    id:number;
    name:string;
    categories:Category[]
}