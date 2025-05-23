import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // URL string from Cloudinary
      required: true,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    flashSalePrice: {
      type: Number,
      default: null,
    },
    flashSaleStart: {
      type: Date,
      default: null,
    },
    flashSaleEnd: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.methods.isFlashSaleActive = function () {
  const now = new Date();
  return (
    this.isFlashSale && this.flashSaleStart <= now && this.flashSaleEnd >= now
  );
};
export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
