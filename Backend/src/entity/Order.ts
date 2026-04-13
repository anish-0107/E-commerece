import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItems";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    Orderid: number

    @Column("decimal",{precision:10, scale:2})
    totalAmount:number

    @CreateDateColumn()
    orderDate:Date

    @Column()
    paymentMethod:string

    @ManyToOne(()=> User, (user)=>user.order)
    user:User

    @OneToMany(()=>OrderItem, (items)=>items.order)
    items:OrderItem[]

}