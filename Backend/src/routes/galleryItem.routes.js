import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  createGalleryItem,
  updateGalleryItem,
  getGalleryItem,
  getAllGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryItem.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  upload.fields([{ name: "image", maxCount: 1 }]),
  createGalleryItem
);

router.patch(
  "/:galleryId",
  verifyJWT,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateGalleryItem
);

router.get("/:galleryId", verifyJWT, getGalleryItem);

router.get("/", verifyJWT, getAllGalleryItem);

router.delete("/:galleryId", verifyJWT, deleteGalleryItem);

export default router;
