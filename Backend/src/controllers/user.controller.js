import { User } from "../models/user.model";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      "500",
      "Something went wrong when generating Access token and Refresh token "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, firstName, lastName, phone, password } = req.body;
  if ([username, email, firstName, lastName, phone, password].some((f) => !f)) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const profileImageLocalPath = req.files?.profile?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!profileImageLocalPath) {
    throw new ApiError(400, "Profile Image is required");
  }
  const profileImage = await uploadToCloudinary(profileImageLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadToCloudinary(coverImageLocalPath)
    : null;
  if (!profileImage) {
    throw new ApiError(400, "Profile Image upload failed");
  }
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    firstName,
    lastName,
    phone,
    password,
    profileImage: profileImage.url,
    coverImage: coverImage?.url || "",
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Wrong password");
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) {
    throw new ApiError(400, "Login failed");
  }
  const options = {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: "" } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Enter both the passwords");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Enter the valid old password");
  }

  user.password = newPassword;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        firstName,
        lastName,
        email: email.toLowerCase(),
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated Successfully"));
});

const updateUserProfileImage = asyncHandler(async (req, res) => {
  const profileImageLocalPath = req.files?.profile?.[0]?.path;

  if (!profileImageLocalPath) {
    throw new ApiError(400, "Profile image is missing");
  }

  const profileImage = await uploadToCloudinary(profileImageLocalPath);

  if (!profileImage || !profileImage.url) {
    throw new ApiError(400, "Error while uploading Profile Image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { profileImage: profileImage.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile Image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is missing");
  }
  const coverImage = await uploadToCloudinary(coverImageLocalPath);
  if (!coverImage || !coverImage.url) {
    throw new ApiError(400, "Error while uploading Cover Image");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage updated successfully"));
});

export {
  generateAccessTokenAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserProfileImage,
  updateUserCoverImage,
};
