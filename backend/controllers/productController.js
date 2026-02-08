import Product from "../models/Product.js";

/* ================== GET ALL ================== */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================== GET SINGLE ================== */
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("GET SINGLE PRODUCT ERROR:", err);
    res.status(400).json({ message: "Invalid product ID" });
  }
};

/* ================== CREATE ================== */
export const createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const images = req.files.map((file) => `/uploads/${file.filename}`);

    const product = await Product.create({
      title: req.body.title,
      price: Number(req.body.price),
      mrp: Number(req.body.mrp),
      category: req.body.category,
      description: req.body.description,
      stock: Number(req.body.stock),
      sizes: JSON.parse(req.body.sizes || "[]"),
      colors: JSON.parse(req.body.colors || "[]"),
      images,
      isTrending: req.body.isTrending === "true",
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================== UPDATE (JSON SAFE) ================== */
export const updateProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      mrp,
      category,
      description,
      stock,
      isTrending,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        price: Number(price),
        mrp: Number(mrp),
        category,
        description,
        stock: Number(stock),
        isTrending,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================== DELETE ================== */
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ================== TRENDING ================== */
export const trendingProducts = async (req, res) => {
  const products = await Product.find({ isTrending: true }).limit(8);
  res.json(products);
};

/* ================== NEW ARRIVALS ================== */
export const newArrivals = async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const products = await Product.find({
    createdAt: { $gte: sevenDaysAgo },
  });
  res.json(products);
};