import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    /* =========================
       USER
    ========================= */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* =========================
       ITEMS
    ========================= */
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    /* =========================
       AMOUNT
    ========================= */
    totalAmount: {
      type: Number,
      required: true,
    },

    /* =========================
       ORDER TIMELINE
    ========================= */
    timeline: [
      {
        status: String,
        date: { type: Date, default: Date.now },
      },
    ],

    /* =========================
       SHIPPING
    ========================= */
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
    },

    /* =========================
       ORDER STATUS
    ========================= */
    status: {
      type: String,
      default: "Placed",
    },

    /* =========================
       RETURN / REPLACE
    ========================= */
    returnRequest: {
      requested: { type: Boolean, default: false },
      type: {
        type: String,
        enum: ["RETURN", "REPLACE"],
      },
      reason: String,
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    },

    replacementFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    /* =========================
       PAYMENT
    ========================= */
    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },

    // ✅ REQUIRED FOR REFUND
    razorpayPaymentId: {
      type: String,
    },
    items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: Number,
    price: Number,
  },
],


    razorpayOrderId: {
      type: String,
    },
    status: {
  type: String,
  enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
},


    refundId: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
