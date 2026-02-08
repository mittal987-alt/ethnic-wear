import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  toggleWishlist,
  getWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/:productId", authMiddleware, toggleWishlist); // ✅
router.get("/", authMiddleware, getWishlist);

export default router;