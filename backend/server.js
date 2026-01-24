import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

connectDB();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cookieParser());
app.use(express.json());

// ✅ CORS (WORKS FOR LOCAL + VERCEL)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-frontend.vercel.app", // add later
    ],
    credentials: true,
  })
);

// ✅ Serve uploaded images
const __dirname = path.resolve();
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);

/* ---------------- TEST ROUTE ---------------- */

app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
