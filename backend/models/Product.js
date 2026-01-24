import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["kurti", "suit", "lehenga", "dupatta"],
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    
    isTrending: {
      type: Boolean,
      default: false, // admin controls this
    },
   image: {
    type: String,
    },

  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
