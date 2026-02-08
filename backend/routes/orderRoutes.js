import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import razorpay from "../config/razorpay.js";

const router = express.Router();

/* =========================
   CREATE ORDER (USER)
========================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user._id,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      paymentStatus:
        req.body.paymentMethod === "COD" ? "Pending" : "Pending",
      status: "Placed",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

/* =========================
   MY ORDERS (USER)
========================= */
router.get("/my", authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

/* =========================
   ALL ORDERS (ADMIN)
========================= */
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/* =========================
   UPDATE ORDER STATUS (ADMIN)
========================= */
router.put("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).json({ message: "Order not found" });

  order.status = req.body.status;
  await order.save();

  res.json(order);
});

/* =========================
   CANCEL ORDER (USER / ADMIN)
========================= */
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  if (
    !req.user.isAdmin &&
    order.user.toString() !== req.user._id.toString()
  )
    return res.status(403).json({ message: "Not allowed" });

  if (order.status === "Delivered" || order.status === "Cancelled")
    return res
      .status(400)
      .json({ message: "Order cannot be cancelled" });

  order.status = "Cancelled";
  await order.save();

  res.json(order);
});

/* =========================
   REQUEST RETURN / REPLACE (USER)
========================= */
router.post("/:id/return", authMiddleware, async (req, res) => {
  const { type, reason } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(404).json({ message: "Order not found" });

  if (order.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });

  if (order.status !== "Delivered")
    return res
      .status(400)
      .json({ message: "Only delivered orders allowed" });

  order.returnRequest = {
    requested: true,
    type, // RETURN / REPLACE
    reason,
    status: "Pending",
  };

  await order.save();
  res.json(order);
});

/* =========================
   HANDLE RETURN / REPLACE (ADMIN)
========================= */
router.put(
  "/:id/return/decision",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    const { decision } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order || !order.returnRequest?.requested)
      return res
        .status(404)
        .json({ message: "No return request found" });

    order.returnRequest.status = decision;

    if (decision === "Approved" && order.returnRequest.type === "RETURN") {
      order.status = "Cancelled";
    }

    if (decision === "Approved" && order.returnRequest.type === "REPLACE") {
      order.status = "Processing";
    }

    await order.save();
    res.json(order);
  }
);
router.get("/can-review/:productId", authMiddleware, async (req, res) => {
  const order = await Order.findOne({
    user: req.user._id,
    status: "Delivered",
    "items.product": req.params.productId,
  });

  res.json({ canReview: !!order });
});
router.put("/:id/status", authMiddleware, adminOnly, async (req, res) => {
  const { status, courier, trackingNumber, expectedDelivery } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;

  order.timeline.push({
    status,
    date: new Date(),
  });

  if (courier) order.courier = courier;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (expectedDelivery) order.expectedDelivery = expectedDelivery;

  await order.save();
  res.json(order);
});


/* =========================
   REFUND (ADMIN — RAZORPAY)
========================= */
router.post(
  "/:id/refund",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order)
        return res.status(404).json({ message: "Order not found" });

      if (order.paymentMethod !== "RAZORPAY")
        return res
          .status(400)
          .json({ message: "Refund only for Razorpay orders" });

      if (order.paymentStatus !== "Paid")
        return res
          .status(400)
          .json({ message: "Payment not completed" });

      if (!order.razorpayPaymentId)
        return res
          .status(400)
          .json({ message: "Payment ID missing" });

      const refund = await razorpay.payments.refund(
        order.razorpayPaymentId,
        { amount: order.totalAmount * 100 }
      );

      order.paymentStatus = "Refunded";
      order.status = "Cancelled";
      order.refundId = refund.id;

      await order.save();
      res.json(order);
    } catch (err) {
      console.error("REFUND ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* =========================
   ADMIN STATS
========================= */
router.get("/stats/admin", authMiddleware, adminOnly, async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const delivered = await Order.countDocuments({ status: "Delivered" });
  const cancelled = await Order.countDocuments({ status: "Cancelled" });

  const revenueAgg = await Order.aggregate([
    { $match: { paymentStatus: "Paid" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  res.json({
    totalOrders,
    delivered,
    cancelled,
    totalRevenue: revenueAgg[0]?.total || 0,
  });
});

export default router;
