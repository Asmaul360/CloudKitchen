import { Order } from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  const {
    userId,
    foodId,
    qty,
    comments,
    totalPrice,
    paymentStatus,
    receiverName,
    phone,
    street,
    city,
    state,
    pincode,
    landmark,
    orderStatus,
  } = req.body;

  if (
    !userId ||
    !foodId ||
    !qty ||
    !receiverName ||
    !phone ||
    !street ||
    !city ||
    !state ||
    !pincode
  ) {
    throw new ApiError(400, "Important fields are missing");
  }

  const order = await Order.create({
    userId,
    items: [{ foodId, qty }],
    comments,
    totalPrice,
    paymentStatus,
    deliveryAddress: {
      receiverName,
      phone,
      street,
      city,
      state,
      pincode,
      landmark,
    },
    orderStatus,
  });

  if (!order) {
    throw new ApiError(400, "Failed to create order");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate("userId")
    .populate("items.foodId");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

const getAllOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("userId").populate("items.foodId");

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const updateOrder = asyncHandler(async (req, res) => {
  const {
    foodId,
    qty,
    comments,
    totalPrice,
    paymentStatus,
    receiverName,
    phone,
    street,
    city,
    state,
    pincode,
    landmark,
    orderStatus,
  } = req.body;

  const { orderId } = req.params;

  const updateData = {};

  if (foodId || qty) {
    updateData.items = [{ foodId, qty }];
  }

  if (comments) updateData.comments = comments;
  if (totalPrice) updateData.totalPrice = totalPrice;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  if (orderStatus) updateData.orderStatus = orderStatus;
  const address = {};
  if (receiverName) address.receiverName = receiverName;
  if (phone) address.phone = phone;
  if (street) address.street = street;
  if (city) address.city = city;
  if (state) address.state = state;
  if (pincode) address.pincode = pincode;
  if (landmark) address.landmark = landmark;

  if (Object.keys(address).length > 0) {
    updateData.deliveryAddress = address;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field must be updated");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: updateData },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order updated successfully"));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Order deleted successfully"));
});

export { createOrder, getOrder, getAllOrder, updateOrder, deleteOrder };
