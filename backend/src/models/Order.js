const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            productId: String,
            name: String,
            price: Number,
            quantity: Number,
        },
    ],
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["Paid", "Processing", "Shipped", "Delivered", "Cancelled"], 
        default: "Paid" 
    },
    tracking: {
        paidAt: { type: Date },
        processingAt: { type: Date },
        shippedAt: { type: Date },
        deliveredAt: { type: Date },
        cancelledAt: { type: Date },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
