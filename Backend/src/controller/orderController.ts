import { Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { AuthRequest } from "../types/auth.types"
import { AppDatasorce } from "../data-source"
import { CartItem } from "../entity/CartItem"
import { Order } from "../entity/Order"
import { OrderItem } from "../entity/OrderItems"
import { Product } from "../entity/product"
import { log } from "node:console"

const orderRepo = AppDatasorce.getRepository(Order)

export const placeOrder = async (req: AuthRequest, res: Response) => {

    const { payMethod } = req.body;
    const userId = req.user.id;

    const queryRunner = AppDatasorce.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const cartItems = await queryRunner.manager
            .createQueryBuilder(CartItem, "cart")
            .leftJoinAndSelect("cart.product", "product")
            .where("cart.userId = :userId", { userId })
            .getMany();

        if (cartItems.length === 0) {
            await queryRunner.rollbackTransaction();
            return res.status(400).json("Cart is empty");
        }

        const insertOrder = await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Order)
            .values({
                user: { id: userId },
                paymentMethod: payMethod,
                totalAmount: 0
            })
            .execute();

        const orderId = insertOrder.identifiers[0].Orderid;
        console.log("Generated Identifiers:", insertOrder.identifiers[0]);
        let calculatedTotal = 0;
        const orderItemsData = [];

        for (const item of cartItems) {
            const product = item.product;

            if (product.Stockquantity < item.quantity) {
                throw new Error(`Item ${product.name} is out of stock`);
            }

            const itemPriceSum = Number(product.price) * item.quantity;
            calculatedTotal += itemPriceSum;

            orderItemsData.push({
                order: { Orderid: orderId },
                product: { id: product.id },
                quantity: item.quantity,
                amountAtPurchase: product.price
            });

            console.log(orderItemsData, "this is data");


            await queryRunner.manager
                .createQueryBuilder()
                .update(Product)
                .set({ Stockquantity: () => `Stockquantity - ${item.quantity}` })
                .where("id = :id", { id: product.id })
                .execute();
        }

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(OrderItem)
            .values(orderItemsData)
            .execute();

        await queryRunner.manager
            .createQueryBuilder()
            .update(Order)
            .set({ totalAmount: calculatedTotal })
            .where("Orderid = :id", { id: orderId })
            .execute();

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(CartItem)
            .where("userId = :userId", { userId })
            .execute();

        await queryRunner.commitTransaction();
        res.status(201).json({ message: "Order placed successfully", orderId });

    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error("Transaction Error:", err);
        res.status(400).json({ error: err.message || "Order placement failed" });
    } finally {
        await queryRunner.release();
    }
};

export const getOrderHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id

    const history = await orderRepo.find({ where: { user: { id: userId } }, relations: ['items'] })
    res.status(200).json(history)
})

export const Allorders = catchAsync(async (req: Request, res: Response) => {

    const orders = await orderRepo.find({ relations: ['user'] })

    res.json({
        data: orders,
        message: "orders fetched sucessfullty"
    })
})


export const getOrderDeatils = catchAsync(async (req: AuthRequest, res: Response) => {

    const orderId = parseInt(req.params.orderId as string)
    console.log(orderId);



    const deatils = await orderRepo.findOne({ where: { Orderid: orderId }, relations: ['items'] })

    if (!deatils) {
        res.status(400).json("no order id Match")
    }

    res.status(200).json({ deatils })
})

export const deleteOrder = catchAsync(async(req:AuthRequest,res:Response)=>{

    const orderId = Number(req.params.orderId)
    console.log(orderId,"this is orderid ");
    
    const order = await orderRepo.findOne({where:{Orderid:orderId}})

    await orderRepo.delete(orderId);
    res.json({order})
})