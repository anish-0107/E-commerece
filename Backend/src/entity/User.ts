import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { CartItem } from "./CartItem";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column({unique:true})
    email:string

    @Column()
    passowrd:string

    @Column()
    role:string

    @Column({default:false})
    isLocked:boolean

    @OneToMany(()=>Order, (order)=>order.user)
    order:Order

    @OneToMany(()=> CartItem, (cart)=>cart.user)
    cartItem:CartItem

    @Column({nullable:true})
    resetCode:String

    @Column({nullable:true})
    codeExpiresOn:Date

    @BeforeInsert()
    @BeforeUpdate()
    toLowerCase() {
        if (this.role) {
            this.role = this.role.toLowerCase();
        }
    }

}