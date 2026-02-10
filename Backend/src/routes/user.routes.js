import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserProfileImage,
  updateUserCoverImage,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

// FOR USERS
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", verifyJWT, refreshAccessToken);

router.get("/current-user", verifyJWT, getCurrentUser);

router.patch("/change-password", verifyJWT, changePassword);
router.patch("/update-account", verifyJWT, updateAccountDetails);

router.patch(
  "/profile-image",
  verifyJWT,
  upload.single("profileImage"),
  updateUserProfileImage
);
router.patch(
  "/cover-image",
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);
// ONLY FOR ADMINS
router.get("/all", verifyJWT, verifyRole("admin"), getAllUsers);
router.delete("/:userId", verifyJWT, verifyRole("admin"), deleteUser);

export default router;
