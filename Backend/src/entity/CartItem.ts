import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./product";

@Entity()
export class CartItem{

    @PrimaryGeneratedColumn()
    id:number

    @Column({default:1})
    quantity:number

    @ManyToOne(() => User, {onDelete:'CASCADE'})
    user:User

    @ManyToOne(()=> Product,{onDelete:"CASCADE"} )
    product:Product

    @UpdateDateColumn()
    updatedAt: Date;
}