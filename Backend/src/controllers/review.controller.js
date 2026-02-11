import { Review } from "../models/review.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createReview = asyncHandler(async (req, res) => {
  const { userId, foodId, qty, orderId, foodReview, deliveryReview, comments } =
    req.body;

  if (!userId || !foodId || !qty || !orderId) {
    throw new ApiError(400, "User, food, qty, and orderId are required");
  }

  const existingReview = await Review.findOne({ userId, orderId });
  if (existingReview) {
    throw new ApiError(409, "You have already reviewed this order");
  }

  const review = await Review.create({
    userId,
    orderId,
    items: [
      {
        foodId,
        qty,
      },
    ],
    foodReview,
    deliveryReview,
    comments,
  });

  if (!review) {
    throw new ApiError(400, "Failed to add review");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createReview, "Review created successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const { qty, foodId, foodReview, deliveryReview, comments } = req.body;
  const { reviewId } = req.params;

  if (!qty || !foodId) {
    throw new ApiError(400, "Food ID and qty are required");
  }

  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      $set: {
        items: [{ foodId, qty }],
        foodReview,
        deliveryReview,
        comments,
      },
    },
    { new: true }
  );

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));
});

const getReview = asyncHandler(async (req, res) => {
  const { userId, orderId } = req.params;

  const review = await Review.findOne({ userId, orderId });

  if (!review) {
    throw new ApiError(404, "Review does not exist for this order and user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review fetched successfully"));
});

const getAllReview = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });

  if (!reviews || reviews.length === 0) {
    throw new ApiError(404, "No reviews found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "All reviews fetched successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export { createReview, updateReview, getReview, getAllReview, deleteReview };
