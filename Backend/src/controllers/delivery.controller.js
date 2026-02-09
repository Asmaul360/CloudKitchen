import { Delivery } from "../models/delivery.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

const addDelivery = asyncHandler(async (req, res) => {
  const { orderId, deliveryPersonId, deliveryStatus, deliveredAt } = req.body;

  if (!orderId || !deliveryPersonId || !deliveryStatus) {
    throw new ApiError(400, "All fields are required");
  }

  const existingDelivery = await Delivery.findOne({ orderId });
  if (existingDelivery) {
    throw new ApiError(400, "Delivery is already assigned for this order");
  }

  const delivery = await Delivery.create({
    orderId,
    deliveryPersonId,
    deliveryStatus,
    deliveredAt,
  });

  if (!delivery) {
    throw new ApiError(400, "Failed to assign delivery");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, delivery, "Delivery assigned successfully"));
});

const updateDelivery = asyncHandler(async (req, res) => {
  const { deliveryPersonId, deliveryStatus } = req.body;
  const { deliveryId } = req.params;

  if (!deliveryPersonId && !deliveryStatus) {
    throw new ApiError(400, "At least one field is required");
  }

  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    throw new ApiError(404, "Delivery record not found");
  }

  if (deliveryPersonId) {
    delivery.deliveryPersonId = deliveryPersonId;
  }

  if (deliveryStatus) {
    delivery.deliveryStatus = deliveryStatus;
  }

  if (deliveryStatus === "delivered") {
    delivery.deliveredAt = new Date();
  }

  await delivery.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, delivery, "Delivery details updated successfully")
    );
});

const getDelivery = asyncHandler(async (req, res) => {
  const delivery = await Delivery.findById(req.params.deliveryId);
  if (!delivery) {
    throw new ApiError(400, "Delivery record not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, delivery, "Delivery details fetched successfully")
    );
});

const getAllDelivery = asyncHandler(async (req, res) => {
  const deliveries = await Delivery.find().sort({ createdAt: -1 });
  if (!deliveries || deliveries.length === 0) {
    throw new ApiError(404, "No delivery records found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deliveries,
        "All Delivery details fetched successfully"
      )
    );
});

const getDeliveryPersonDetails = asyncHandler(async (req, res) => {
  const { deliveryPersonId } = req.params;

  const deliveries = await Delivery.find({ deliveryPersonId });

  if (!deliveries || deliveries.length === 0) {
    throw new ApiError(404, "No deliveries found for this delivery person");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deliveries,
        "Delivery person details fetched successfully"
      )
    );
});

export {
  addDelivery,
  updateDelivery,
  getDelivery,
  getAllDelivery,
  getDeliveryPersonDetails,
};
