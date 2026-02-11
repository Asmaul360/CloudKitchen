import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createCart,
  getCart,
  updateCart,
  deleteItem,
  clearCart,
  getAllCarts,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", verifyJWT, createCart);

router.get("/:userId", verifyJWT, getCart);

router.patch("/:userId", verifyJWT, updateCart);

router.delete("/:userId", verifyJWT, deleteItem);

router.delete("/:userId/clear", verifyJWT, clearCart);

router.get("/", verifyJWT, getAllCarts);

export default router;
