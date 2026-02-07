import { GalleryItem } from "../models/galleyItem.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../utils/cloudinary.js";

const createGalleryItem = asyncHandler(async (req, res) => {
  const { title, subtitle, type, actionLink } = req.body;

  if (!title || !subtitle || !type || !actionLink) {
    throw new ApiError(400, "All fields are required");
  }

  const existingGalleryItem = await GalleryItem.findOne({
    $or: [{ title }, { subtitle }],
  });

  if (existingGalleryItem) {
    throw new ApiError(
      409,
      "Gallery item with this title or subtitle already exists"
    );
  }

  const galleryImageLocalPath = req.files?.image?.[0]?.path;
  if (!galleryImageLocalPath) {
    throw new ApiError(400, "Gallery image is required");
  }

  const galleryImage = await uploadToCloudinary(galleryImageLocalPath);
  if (!galleryImage) {
    throw new ApiError(400, "Gallery image upload failed");
  }

  const gallery = await GalleryItem.create({
    title,
    subtitle,
    image: galleryImage.url,
    type,
    actionLink,
  });

  if (!gallery) {
    throw new ApiError(400, "Failed to create gallery item");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, gallery, "Gallery item created successfully"));
});
const updateGalleryItem = asyncHandler(async (req, res) => {
  const { title, subtitle, type, actionLink } = req.body;

  if (!title || !subtitle || !type || !actionLink) {
    throw new ApiError(400, "All fields are required to be filled");
  }

  const existing = await GalleryItem.findById(req.params.galleryId);
  if (!existing) {
    throw new ApiError(404, "Gallery item not found");
  }
  const duplicate = await GalleryItem.findOne({
    _id: { $ne: req.params.galleryId },
    $or: [{ title }, { subtitle }],
  });

  if (duplicate) {
    throw new ApiError(409, "Title or subtitle already used in another item");
  }

  let imageUrl = existing.image;

  const image = req.files?.image?.[0]?.path;

  if (image) {
    const uploadImage = await uploadToCloudinary(image);
    if (!uploadImage) {
      throw new ApiError(400, "Failed to upload image");
    }

    if (uploadImage.url === existing.image) {
      throw new ApiError(
        400,
        "New image is same as previous image — upload a different image"
      );
    }

    imageUrl = uploadImage.url;
  }

  const update = await GalleryItem.findByIdAndUpdate(
    req.params.galleryId,
    {
      $set: {
        title,
        subtitle,
        type,
        actionLink,
        image: imageUrl,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, update, "Gallery has been updated successfully")
    );
});
const getGalleryItem = asyncHandler(async (req, res) => {
  const gallery = await GalleryItem.findById(req.params.galleryId);
  if (!gallery) {
    throw new ApiError(404, "Gallery item not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, gallery, "Gallery fetched successfully"));
});
const getAllGalleryItem = asyncHandler(async (req, res) => {
  const gallery = await GalleryItem.find();

  return res
    .status(200)
    .json(
      new ApiResponse(200, gallery, "All Gallery item fetched successfully")
    );
});
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const gallery = await GalleryItem.findById(req.params.galleryId);
  if (!gallery) {
    throw new ApiError(404, "Gallery item not found");
  }

  const imageUrl = gallery.image;
  const publicId = imageUrl.split("/").pop().split(".")[0];

  await cloudinary.uploader.destroy(publicId);

  await gallery.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Gallery item deleted successfully"));
});

export {
  createGalleryItem,
  updateGalleryItem,
  getGalleryItem,
  getAllGalleryItem,
  deleteGalleryItem,
};
