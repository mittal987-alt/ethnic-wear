import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* GET WISHLIST */
router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
});

/* TOGGLE WISHLIST */
router.post("/:productId", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  const exists = user.wishlist.includes(productId);

  if (exists) {
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  res.json(user.wishlist);
});

export default router;
