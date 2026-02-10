import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    address: [
      {
        _id: false,
        receiverName: { type: String, trim: true },
        phone: { type: String, trim: true },
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        landmark: { type: String, trim: true },
      },
    ],

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    phone: { type: Number, required: true },

    profileImage: { type: String, required: true },
    coverImage: { type: String },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "user", "delivery"],
      default: "user",
    },

    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// FIXED: sending username + role inside access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );
};

// FIXED: refresh token MUST also send role + username if needed
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      role: this.role,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
};

export const User = mongoose.model("User", userSchema);
