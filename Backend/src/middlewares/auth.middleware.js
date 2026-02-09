import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.header("Authorization")
        ? req.header("Authorization").replace("Bearer ", "").trim()
        : null);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
export const fetchVideo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //req.params.id → gets the ID from URL (:id)
  if (!id) {
    return next(new ApiError(400, "Video ID is required"));
  }
  const video = await Video.findById(id);
  // Video.findById(id) → fetches that specific video from database
  if (!video) {
    return next(new ApiError(404, "Video not found"));
  }
  req.video = video; // attach video to request
  // req.video = video → now controller can access that video directly, without another DB query
  next();
});
