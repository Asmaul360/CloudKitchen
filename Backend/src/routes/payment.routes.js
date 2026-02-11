import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createPayment,
  updatePayment,
  getPayment,
  getAllPayment,
  deletePayment,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/", verifyJWT, createPayment);

router.patch("/:paymentId", verifyJWT, updatePayment);

router.get("/:paymentId", verifyJWT, getPayment);

router.get("/", verifyJWT, getAllPayment);

router.delete("/:paymentId", verifyJWT, deletePayment);

export default router;
