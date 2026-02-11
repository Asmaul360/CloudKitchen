import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createReview,
  updateReview,
  getReview,
  getAllReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = Router();

router.post("/", verifyJWT, createReview);

router.patch("/:reviewId", verifyJWT, updateReview);

router.get("/user/:userId", verifyJWT, getAllReview);

router.get("/:reviewId", verifyJWT, getReview);

router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;
