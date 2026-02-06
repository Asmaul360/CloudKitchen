import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    category: {
      type: String,
      enum: ["veg", "non-veg", "beverages", "combo"],
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    addOn: [
      {
        type: String,
        enum: ["extra cheese", "sauce", "mayonnaise", "double cheese"],
      },
    ],
  },
  { timestamps: true }
);

export const Food = mongoose.model("Food", foodSchema);
