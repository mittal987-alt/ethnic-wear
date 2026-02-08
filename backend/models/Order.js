import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Placed",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },

    timeline: [
      {
        status: String,
        date: { type: Date, default: Date.now },
      },
    ],

    courier: String,
    trackingNumber: String,
    expectedDelivery: Date,

    returnRequest: {
      requested: { type: Boolean, default: false },
      type: { type: String, enum: ["RETURN", "REPLACE"] },
      reason: String,
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    },

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
    deliveredAt: {
  type: Date,
},

returnWindowDays: {
  type: Number,
  default: 7, // 👈 configurable
},

    
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
