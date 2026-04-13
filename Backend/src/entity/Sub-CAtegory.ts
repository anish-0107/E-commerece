import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";
import { Product } from "./product";

@Entity()
export class SubCategory{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    name:string

    @ManyToOne(()=> Category, (category)=>category.subCategory)
    category:Category

    @OneToMany(()=>Product,(prod)=>prod.category)
    product:Product
}