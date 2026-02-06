import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    comments: {
      type: String,
      trim: true,
    },
    totalPrice: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "failed", "refunded"],
      default: "pending",
    },
    deliveryAddress: {
      receiverName: { type: String, trim: true },
      phone: { type: String, trim: true },
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      landmark: { type: String, trim: true },
    },
    orderStatus: {
      type: String,
      enum: ["placed", "cooking", "on-way", "delivered"],
      default: "placed",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
