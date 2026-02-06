import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    deliveryPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deliveryStatus: {
      type: String,
      enum: ["assigned", "picked-up", "on-way", "delivered"],
      default: "assigned",
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Delivery = mongoose.model("Delivery", deliverySchema);
