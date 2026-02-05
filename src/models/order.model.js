import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
        qty: Number,
      },
    ],
    totalPrice: Number,
    paymentStatus: String,
    deliveryAddress: Object,
    orderStatus: {
      type: String,
      enum: ["placed", "cooking", "on-way", "delivered"],
      default: "placed",
    },
  },

  { timestamps: true }
);
