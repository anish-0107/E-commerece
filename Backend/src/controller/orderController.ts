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
        // 1. Get Cart Items using Query Builder
        const cartItems = await queryRunner.manager
            .createQueryBuilder(CartItem, "cart")
            .leftJoinAndSelect("cart.product", "product")
            .where("cart.userId = :userId", { userId })
            .getMany();

        if (cartItems.length === 0) {
            await queryRunner.rollbackTransaction();
            return res.status(400).json("Cart is empty");
        }

        // 2. Create the initial Order
        const insertOrder = await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Order)
            .values({
                user: { id: userId },
                paymentMethod: payMethod,
                totalAmount: 0 // Will update this later
            })
            .execute();

        const orderId = insertOrder.identifiers[0].Orderid;
        let calculatedTotal = 0;
        const orderItemsData = [];

        // 3. Process items and update stock
        for (const item of cartItems) {
            const product = item.product;

            if (product.Stockquantity < item.quantity) {
                throw new Error(`Item ${product.name} is out of stock`);
            }

            const itemPriceSum = Number(product.price) * item.quantity;
            calculatedTotal += itemPriceSum;

            // Prepare data for bulk insert
            orderItemsData.push({
                order: { id: orderId },
                product: { id: product.id },
                quantity: item.quantity,
                amountAtPurchase: product.price // Individual price at time of purchase
            });

            // 4. Update Product Stock using Query Builder
            await queryRunner.manager
                .createQueryBuilder()
                .update(Product)
                .set({ Stockquantity: () => `Stockquantity - ${item.quantity}` })
                .where("id = :id", { id: product.id })
                .execute();
        }

        // 5. Bulk Insert Order Items (Much faster than saving in a loop)
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(OrderItem)
            .values(orderItemsData)
            .execute();

        // 6. Update the Order with the final total
        await queryRunner.manager
            .createQueryBuilder()
            .update(Order)
            .set({ totalAmount: calculatedTotal })
            .where("Orderid = :id", { id: orderId })
            .execute();

        // 7. Clear Cart
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

export const getOrderHistory = catchAsync(async(req:AuthRequest, res:Response)=>{
    const userId= req.user.id

    const history = await orderRepo.find({where:{user:{id:userId}}, relations:['items']})
    res.status(200).json(history)
})

export const Allorders = catchAsync(async(req:Request,res:Response)=>{

    const orders =  await orderRepo.find({relations:['user']})

    res.json({
        data:orders,
        message:"orders fetched sucessfullty"
    })
})


export const getOrderDeatils = catchAsync(async(req:AuthRequest, res:Response)=>{

    const orderId = parseInt(req.params.orderId as string) 
    console.log(orderId);
    

    
    const deatils = await orderRepo.findOne({where:{Orderid:orderId}, relations:['items']})

    if(!deatils){
        res.status(400).json("no order id Match")
    }

    res.status(200).json({deatils})
})