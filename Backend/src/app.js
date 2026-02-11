import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import foodRouter from "./routes/food.routes.js";
import galleryItemRouter from "./routes/galleryItem.routes.js";
import orderItemRouter from "./routes/order.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/galleryItem", galleryItemRouter);
app.use("/api/v1/orderItem", orderItemRouter);

export default app;
