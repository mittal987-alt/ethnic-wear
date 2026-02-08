import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js";

import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  trendingProducts,
  newArrivals,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/trending", trendingProducts);
router.get("/new-arrivals", newArrivals);
router.get("/:id", getSingleProduct);

router.post(
  "/",
  authMiddleware,
  adminOnly,
  upload.array("images", 5), // 👈 multiple photos
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  deleteProduct
);

export default router;
