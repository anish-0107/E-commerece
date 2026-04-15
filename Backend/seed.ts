import { AppDatasorce } from "./src/data-source";
import { Category } from "./src/entity/Category";
import { Product } from "./src/entity/product";
import { ProductType } from "./src/entity/product-type";
import { SubCategory } from "./src/entity/Sub-CAtegory";
import { User } from "./src/entity/User";


export const SeedDatabse = async () => {
    try {

        await AppDatasorce.initialize();
        
        const typeRepo = AppDatasorce.getRepository(ProductType);
        const catRepo = AppDatasorce.getRepository(Category);
        const subCatRepo = AppDatasorce.getRepository(SubCategory);
        const prodRepo = AppDatasorce.getRepository(Product);
        const userRepo = AppDatasorce.getRepository(User);

        console.log("🌱 Starting Repository-based seeding...");

        // --- 1. Seed Product Type ---
        const electronicsType = typeRepo.create({ name: 'Electronics' });
        const savedType = await typeRepo.save(electronicsType);

        // --- 2. Seed Category (Linked to Type) ---
        const computerCat = catRepo.create({ 
            name: 'Computers', 
            type: savedType // Pass the entire object, TypeORM extracts the ID
        });
        const savedCat = await catRepo.save(computerCat);

        // --- 3. Seed Sub-Category (Linked to Category) ---
        const laptopSubCat = subCatRepo.create({ 
            name: 'Laptops', 
            category: savedCat 
        });
        const savedSubCat = await subCatRepo.save(laptopSubCat);

        // --- 4. Seed Product (Linked to Sub-Category) ---
        const product = prodRepo.create({
            name: 'MacBook Pro M3',
            description: 'Powerful Apple Silicon Laptop',
            price: 2499,
            Stockquantity: 25,
            category: savedSubCat, // Hierarchical link
            imagePath: '/productImages/macbook.jpg'
        });
        await prodRepo.save(product);

        // --- 5. Seed User ---
        const user = userRepo.create({
            name: 'Admin User',
            email: 'admin@library.com',
            passowrd: 'hashed_password_here', // In real app, use bcrypt
            role: 'admin'
        });
        await userRepo.save(user);

        console.log("✅ Database seeded successfully using Repositories!");
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

SeedDatabse();
