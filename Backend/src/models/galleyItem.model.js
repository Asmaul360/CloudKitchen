import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["banner", "slider", "featured", "offer"],
      default: "banner",
    },
    actionLink: {
      type: String,
    },
  },
  { timestamps: true }
);

export const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
