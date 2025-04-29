import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    wishlist: [
      {
        productName: { type: String, required: true },
        productLink: { type: String, required: true },
        productImage: { type: String, required: true },
        salePrice: { type: String, required: true },
      },
    ],
  },
  { timestamps: true } 
);

const User = mongoose.model("User", userSchema);

export default User;
