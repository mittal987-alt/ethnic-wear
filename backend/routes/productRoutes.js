import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* =========================
   CREATE PRODUCT (ADMIN)
========================= */
router.post(
  "/",
  authMiddleware,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.create({
        title: req.body.title,
        price: req.body.price,
        category: req.body.category,
        image: req.file ? `/uploads/${req.file.filename}` : null,
       
      });

      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Product creation failed" });
    }
  }
);

/* =========================
   GET ALL PRODUCTS (PUBLIC)
========================= */
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/* =========================
   GET SINGLE PRODUCT
========================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

/* =========================
   UPDATE PRODUCT (ADMIN)
========================= */
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const data = {
        title: req.body.title,
        price: req.body.price,
        category: req.body.category,
        isTrending: req.body.isTrending === "true",
      };

      if (req.file) {
        data.image = `/uploads/${req.file.filename}`;
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
      );

      res.json(product);
    } catch {
      res.status(500).json({ message: "Update failed" });
    }
  }
);

/* =========================
   DELETE PRODUCT (ADMIN)
========================= */
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  }
);
// 🆕 NEW ARRIVALS (LAST 7 DAYS)
router.get("/new-arrivals", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const products = await Product.find({
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch new arrivals" });
  }
});



/* =========================
   TRENDING PRODUCTS
========================= */
router.get("/trending", async (req, res) => {
  const products = await Product.find({ isTrending: true })
    .sort({ updatedAt: -1 })
    .limit(8);
  res.json(products);
});

/* =========================
   ENABLE / DISABLE TRENDING
========================= */
router.put(
  "/:id/trending/enable",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isTrending: true },
      { new: true }
    );

    res.json(product);
  }
);
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});
// 🔥 TRENDING
router.get("/trending", async (req, res) => {
  const products = await Product.find({ isTrending: true });
  res.json(products);
});

// 🆕 NEW ARRIVALS
router.get("/new-arrivals", async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const products = await Product.find({
    createdAt: { $gte: sevenDaysAgo },
  });

  res.json(products);
});


router.put(
  "/:id/trending/disable",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isTrending: false },
      { new: true }
    );

    res.json(product);
  }
);

export default router;
