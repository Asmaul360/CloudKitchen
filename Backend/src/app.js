import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// ❌ Body parsers should NOT run before multer
// app.use(express.json());
// app.use(express.urlencoded());

app.use(cookieParser());
// After routes (optional)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ROUTES SHOULD HANDLE MULTER THEMSELVES
app.use("/api/v1/users", userRouter);

export default app;
