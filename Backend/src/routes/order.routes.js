import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createOrder,
  getOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", verifyJWT, createOrder);

router.get("/", verifyJWT, getAllOrder);

router.get("/:orderId", verifyJWT, getOrder);

router.patch("/:orderId", verifyJWT, updateOrder);

router.delete("/:orderId", verifyJWT, deleteOrder);

export default router;
