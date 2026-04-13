import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";

@Entity()
export class OrderItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @Column("decimal", { precision: 10, scale: 2 })
    amountAtPurchase: number

    @ManyToOne(()=>Order,(order)=>order.items)
    order:Order
}