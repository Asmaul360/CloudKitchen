import { Food } from "../models/food.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

const addFood = asyncHandler(async (req, res) => {
  const { name, description, price, category, addOn } = req.body;

  if (!name || !description || !price || !category) {
    throw new ApiError(400, "All fields should be filled");
  }

  const existingFood = await Food.findOne({ name });
  if (existingFood) {
    throw new ApiError(409, "Food with this name already exists");
  }

  const foodImageLocalPath = req.files?.image?.[0]?.path;
  if (!foodImageLocalPath) {
    throw new ApiError(400, "Food image is required");
  }

  const foodImage = await uploadToCloudinary(foodImageLocalPath);
  if (!foodImage || !foodImage.url) {
    throw new ApiError(400, "Food Image upload failed");
  }

  const food = await Food.create({
    name,
    description,
    price,
    category,
    image: foodImage.url,
    addOn,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, food, "Food added successfully"));
});
const updateFood = asyncHandler(async (req, res) => {
  const { name, description, price, category, addOn } = req.body;

  if (!name || !description || !price || !category) {
    throw new ApiError(400, "All fields should be filled");
  }

  const food = await Food.findByIdAndUpdate(
    req.params.foodId,
    {
      $set: {
        name,
        description,
        price,
        category,
        addOn,
      },
    },
    { new: true }
  );

  if (!food) {
    throw new ApiError(400, "Failed to update Food");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, food, "Food details updated Successfully"));
});
const updateFoodImage = asyncHandler(async (req, res) => {
  const foodImageLocalPath = req.files?.image?.[0]?.path;

  if (!foodImageLocalPath) {
    throw new ApiError(400, "Food image is required");
  }

  const foodImage = await uploadToCloudinary(foodImageLocalPath);

  const food = await Food.findByIdAndUpdate(
    req.params.foodId,
    { image: foodImage.url },
    { new: true }
  );

  if (!food) {
    throw new ApiError(400, "Failed to update food image");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, food, "Food image updated successfully"));
});
const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.foodId);

  if (!food) {
    throw new ApiError(400, "Failed to delete");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Food removed Successfully"));
});
const deleteAllFoods = asyncHandler(async (req, res) => {
  const result = await Food.deleteMany({});
  if (result.deletedCount === 0) {
    throw new ApiError(400, "No foods found to delete");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `${result.deletedCount} foods deleted successfully`
      )
    );
});
const getFoodById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.foodId);

  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, food, "Food fetched successfully"));
});
const getAllFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find().sort({ createdAt: -1 });
  if (!foods || foods.length === 0) {
    throw new ApiError(404, "No delivery records found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, foods, "All foods fetched successfully"));
});

export {
  addFood,
  updateFood,
  updateFoodImage,
  deleteFood,
  deleteAllFoods,
  getFoodById,
  getAllFoods,
};
