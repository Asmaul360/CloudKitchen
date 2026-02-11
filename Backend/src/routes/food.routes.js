import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addFood,
  updateFood,
  updateFoodImage,
  deleteFood,
  deleteAllFoods,
  getFoodById,
  getAllFoods,
} from "../controllers/food.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/add-food",
  upload.fields([{ name: "image", maxCount: 1 }]),
  addFood
);

router.patch("/:foodId", verifyJWT, updateFood);

router.patch(
  "/:foodId/image",
  verifyJWT,
  upload.single("foodImage"),
  updateFoodImage
);

router.get("/", verifyJWT, getAllFoods);
router.get("/:foodId", verifyJWT, getFoodById);
router.delete("/:foodId", verifyJWT, deleteFood);
router.delete("/", verifyJWT, deleteAllFoods);

export default router;
