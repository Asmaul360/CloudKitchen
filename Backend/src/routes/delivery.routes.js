import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  addDelivery,
  updateDelivery,
  getDelivery,
  getAllDelivery,
  getDeliveryPersonDetails,
} from "../controllers/delivery.controller.js";

const router = Router();

router.post("/", verifyJWT, addDelivery);

router.patch("/:deliveryId", verifyJWT, updateDelivery);

router.get("/:deliveryId", verifyJWT, getDelivery);

router.get("/", verifyJWT, getAllDelivery);

router.get("/person/:deliveryPersonId", verifyJWT, getDeliveryPersonDetails);

export default router;
