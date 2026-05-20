const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Customer', 'ShopOwner', 'SuperAdmin'], 
    default: 'Customer' 
  },
  languagePreference: { type: String, default: 'en' },
  darkModePreference: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
