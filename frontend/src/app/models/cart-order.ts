import { Product } from "./taxonomy-model";
import { User } from "./user-model";

export interface CartItem{
    id:number;
    quantity:number;
    prduct:Product
}

export interface Order{
    Orderid:number;
    orderDate:string;
    totalAmount:number;
    paymentMethod:string
    items:OrderItem[]
    user:User
}

export interface OrderItem{
    id:number;
    quantity:number;
    amountAtPurchase:number;
    product:Product
}