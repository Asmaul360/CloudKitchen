import { Cart } from "../models/cart.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createCart = asyncHandler(async (req, res) => {
  const { userId, foodId, qty } = req.body;

  if (!userId || !foodId || !qty) {
    throw new ApiError(400, "userId, foodId, qty are required");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ foodId, qty }],
      totalPrice: 0,
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.foodId.toString() === foodId
    );

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.items.push({ foodId, qty });
    }
  }

  cart.totalPrice = cart.items.reduce((sum, item) => {
    return sum + item.qty * 100;
  }, 0);

  await cart.save();

  return res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId })
    .populate("userId")
    .populate("items.foodId");

  if (!cart) throw new ApiError(404, "Cart not found");

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const updateCart = asyncHandler(async (req, res) => {
  const { foodId, qty } = req.body;

  const cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.find((i) => i.foodId.toString() === foodId);

  if (!item) throw new ApiError(404, "Food item not in cart");

  item.qty = qty;

  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.qty * 100, 0);

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart updated successfully"));
});

const deleteItem = asyncHandler(async (req, res) => {
  const { foodId } = req.body;

  const cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter((item) => item.foodId.toString() !== foodId);

  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.qty * 100, 0);

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Cart cleared successfully"));
});

const getAllCarts = asyncHandler(async (req, res) => {
  const carts = await Cart.find().populate("userId").populate("items.foodId");

  return res
    .status(200)
    .json(new ApiResponse(200, carts, "All carts fetched successfully"));
});

export { createCart, getCart, updateCart, deleteItem, clearCart, getAllCarts };
