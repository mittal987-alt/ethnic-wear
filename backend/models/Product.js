import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    stock: { type: Number, default: 0 },

    sizes: { type: Array, default: [] },
    colors: { type: Array, default: [] },
    images: { type: Array, default: [] },

    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);