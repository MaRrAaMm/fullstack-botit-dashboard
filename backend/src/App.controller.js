import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./DB/connection.js";
import authRouter from "./Modules/auth/auth.controller.js";
import productRouter from "./Modules/product/product.controller.js";
import orderRouter from "./Modules/order/order.controller.js";
import cartRouter from "./Modules/cart/cart.controller.js";

import { notFound, globalError } from "./utils/error/index.js";

const bootstrap = async (app, express) =>{
  app.use(helmet());
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  await connectDB();
  app.use("/api/auth", authRouter);
  app.use("/api/products", productRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/cart", cartRouter);

   //error handling
  app.use(notFound);
  app.use(globalError);

};

export default bootstrap;