import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const router = express.Router();

/* ADD REVIEW – ONLY IF BOUGHT */
router.post("/:id", authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  /* 1️⃣ Check product */
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  /* 2️⃣ Check if user bought & delivered */
  const order = await Order.findOne({
    user: req.user._id,
    status: "Delivered",
    "items.product": productId,
  });

  if (!order) {
    return res.status(403).json({
      message: "Only verified buyers can review this product",
    });
  }

  /* 3️⃣ Prevent duplicate review */
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res
      .status(400)
      .json({ message: "You already reviewed this product" });
  }

  /* 4️⃣ Add review */
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.averageRating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: "Review added successfully" });
});

export default router;
