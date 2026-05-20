const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      size: { type: String },
      color: { type: String }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'], 
    default: 'Pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
