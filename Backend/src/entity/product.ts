import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCategory } from "./Sub-CAtegory";
import { CartItem } from "./CartItem";

@Entity()

export class Product{

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column("text")
    description:string

    @Column("decimal",{precision:10, scale:2})
    price:number

    @Column()
    Stockquantity:number

    @Column({nullable:true})
    imagePath:string

    @ManyToOne(()=>SubCategory, (sub)=>sub.product)
    category:SubCategory

    @OneToMany(()=>CartItem, (cart)=>cart.product)
    cart:CartItem
}