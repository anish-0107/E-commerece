import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppDatasorce } from "../data-source";
import { AuthRequest } from "../types/auth.types";
import { CartItem } from "../entity/CartItem";
import { MoreThan } from "typeorm";
import { log } from "console";

const cartRepo = AppDatasorce.getRepository(CartItem)


// display all items from cart
export const getCart = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id

    const items = await cartRepo.find({
        where: {
            user: { id: userId },
        },
        relations: ["product"]
    })

    res.status(200).json(items)
})


// add item to cart if already updated it
export const addToCart = catchAsync(async (req: AuthRequest, res: Response) => {

    const { productId, quantity } = req.body
    const userId = req.user.id;

    // const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // await cartRepo.createQueryBuilder()
    //     .delete()
    //     .where("user = :userId AND updatedAt < :expiry", {
    //         userId,
    //         expiry: oneHourAgo
    //     })
    //     .execute();

    let item = await cartRepo.findOne({
        where: { user: { id: userId }, product: { id: productId } }
    })

    if (item) {
        item.quantity += quantity
    }
    else {
        item = cartRepo.create({
            user: { id: userId },
            product: { id: productId },
            quantity: Number(quantity)
        })
    }

    await cartRepo.save(item)
    res.status(201).json({ message: "cart updated" , item})

})


// remove the item form cart
export const removeItem = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params

    await cartRepo.delete({ id: parseInt(id as string), user: { id: req.user.id } });
    res.status(200).json({ message: "item removed" })
})


// remove all items from cart
export const clearCart = catchAsync(async (req: AuthRequest, res: Response) => {

    await cartRepo.delete({ user: { id: req.user.id } })
    res.status(200).json({ message: "cart cleared" })

})


//only update no of items in cart
export const updateCartQuantity = catchAsync(async (req: Request, res: Response) => {
    // 1. Force the inputs to be numbers immediately
    const cartItemId = Number(req.body.cartItemId);
    const change = Number(req.body.change);

    console.log(change);
    

    // 2. Find the item
    const cartItem = await cartRepo.findOne({ 
        where: { id: cartItemId } 
    });

    if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
    }

    // 3. Perform math safely
    // Force existing quantity to number in case it's returned as a string from DB
    const currentQty = Number(cartItem.quantity);
    
    if (isNaN(currentQty) || isNaN(change)) {
        return res.status(400).json({ message: "Invalid quantity data received" });
    }

    const newQty = currentQty + change;

    // 4. Validate range
    if (newQty < 1) {
        return res.status(400).json({ message: "Quantity cannot be less than 1" });
    }

    // 5. Update and Save
    cartItem.quantity = newQty;
    await cartRepo.save(cartItem);

    res.json(cartItem);
});

export const getCartTotal = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    // 1. Fetch all cart items for the user, including product details
    const cartItems = await cartRepo.find({
        where: { user: { id: userId } },
        relations: ['product'] // This brings in the price from the Product table
    });

    // 2. Calculate totals
    // Use reduce to sum up (quantity * price) for each item
    const totalAmount = cartItems.reduce((acc, item) => {
        const price = Number(item.product.price);
        const qty = Number(item.quantity);
        return acc + (price * qty);
    }, 0);

    // 3. Count total items (optional but useful for the header/cart icon)
    const totalItems = cartItems.reduce((acc, item) => acc + Number(item.quantity), 0);

    res.status(200).json({
        success: true,
        data: {
            items: cartItems,
            totalAmount: totalAmount,
            totalItems: totalItems
        }
    });
});