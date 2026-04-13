import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductType } from "./product-type";
import { SubCategory } from "./Sub-CAtegory";

@Entity()

export class Category{

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @ManyToOne(()=> ProductType, (type)=>type.categories)
    type:ProductType

    @OneToMany(()=>SubCategory, (sub)=>sub.category)
    subCategory:SubCategory[]
}