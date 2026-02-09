import { Payment } from "../models/payment.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    userId,
    paymentMethod,
    paymentStatus,
    amount,
    transactionId,
  } = req.body;
  if (!orderId || !userId || !transactionId || !paymentMethod || !amount) {
    throw new ApiError(
      400,
      "orderId, userId, amount, paymentMethod, and transactionId are required"
    );
  }
  const existingPayment = await Payment.findOne({ transactionId });
  if (existingPayment) {
    throw new ApiError(409, "Payment already exist");
  }
  const payment = await Payment.create({
    orderId,
    userId,
    paymentMethod,
    paymentStatus,
    amount,
    transactionId,
  });
  if (!payment) {
    throw new ApiError(400, "Failed to create payment ");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, payment, "Payment created successfully"));
});

const updatePayment = asyncHandler(async (req, res) => {
  const {
    orderId,
    userId,
    paymentMethod,
    paymentStatus,
    amount,
    transactionId,
  } = req.body;
  const { paymentId } = req.params;

  const updateData = {};

  if (orderId) updateData.orderId = orderId;
  if (userId) updateData.userId = userId;
  if (paymentMethod) updateData.paymentMethod = paymentMethod;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  if (amount) updateData.amount = amount;
  if (transactionId) updateData.transactionId = transactionId;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field must be updated");
  }

  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    { $set: updateData },
    { new: true }
  );

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment updated successfully"));
});

const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.paymentId);
  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment fetched successfully"));
});

const getAllPayment = asyncHandler(async (req, res) => {
  const payments = await Payment.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, payments, "All payments fetched successfully"));
});

const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.paymentId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Payment deleted successfully"));
});

export {
  createPayment,
  updatePayment,
  getPayment,
  getAllPayment,
  deletePayment,
};
