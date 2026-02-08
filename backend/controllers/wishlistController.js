import User from "../models/User.js";

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    if (index > -1) {
      user.wishlist.splice(index, 1); // remove
    } else {
      user.wishlist.push(productId); // add
    }

    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    console.error("WISHLIST ERROR:", err);
    res.status(500).json({ message: "Wishlist failed" });
  }
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user.id).populate("wishlist");
  res.json(user.wishlist);
};