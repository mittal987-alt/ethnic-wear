import express from "express";
import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE RAZORPAY ORDER */
router.post("/create-order", authMiddleware, async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount * 100, // paise
    currency: "INR",
    receipt: order._id.toString(),
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

/* VERIFY PAYMENT */
router.post("/verify", authMiddleware, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
  if (!order) return res.status(404).json({ message: "Order not found" });

order.paymentStatus = "Paid";
order.razorpayPaymentId = razorpay_payment_id; // ⭐ IMPORTANT
order.razorpayOrderId = razorpay_order_id;     // keep for reference
await order.save();


  res.json({ success: true });
});

export default router;
