import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";

@Entity()
export class ProductType{
    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    name:string

    @OneToMany(()=> Category, (category)=>category.type)
    categories:Category[]
}