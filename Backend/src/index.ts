import { AppDatasorce } from "./data-source";
import express from "express"
import Authroutes from "./routes/Authroutes";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { ErrorHandler } from "./middleware/Error-handler";
import taxonamyRoutes from "./routes/taxonamy";
import productRoutes from "./routes/productRoutes";
import adminprodRoutes from "./routes/productRoutes";
import CartRoutes from "./routes/CartRoutes";
import orderRoutes from "./routes/orderRoutes";
import path from "path"
import adminRoutes from "./routes/adminRoutes";
import rateLimit from "express-rate-limit";
import { globalLimiter } from "./middleware/rateLimite";

const app = express()
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}))

app.use(globalLimiter)
app.use(express.json());
app.use(cookieParser())
app.use('/productImages', express.static(path.join(__dirname, 'productImages')));


//all routes of api
app.use("/auth", Authroutes)

        // all product types and categories , taxonomay
        app.use("/taxo", taxonamyRoutes)

        //all product related operation
        app.use("/prod", adminprodRoutes)

        app.use("/cart", CartRoutes)

        // fro all order routes from place to history
        app.use("/order", orderRoutes)


        app.use('/admincon', adminRoutes)
// '{*path}'
const distPath = path.join(__dirname, '../dist/frontend/browser');
app.use(express.static(distPath));

app.get('{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

AppDatasorce.initialize()
    .then(() => {
        console.log("DB");
        // use all authorisatoin routes
        


        app.listen(3005, () => {
            console.log("server is running on http://localhost:3005");
        })
        app.use(ErrorHandler)
    })