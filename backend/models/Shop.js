const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  shopLogo: { type: String },
  shopBanner: { type: String },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  categories: [{ type: String }], // e.g. 'Men', 'Women'
  deliveryAvailability: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false } // For super admin to approve
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
