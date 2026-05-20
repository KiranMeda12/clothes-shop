const Shop = require('../models/Shop');

// Create a new shop
exports.createShop = async (req, res) => {
  try {
    const { shopName, description, address, contactEmail, contactPhone, categories } = req.body;
    
    // Validate if the user is a ShopOwner
    if (req.user.role !== 'ShopOwner') {
      return res.status(403).json({ message: 'Only ShopOwners can create shops' });
    }

    const existingShop = await Shop.findOne({ owner: req.user.id });
    if (existingShop) {
      return res.status(400).json({ message: 'You already have a shop' });
    }

    const newShop = new Shop({
      shopName,
      description,
      address,
      contactEmail,
      contactPhone,
      categories,
      owner: req.user.id
    });

    const savedShop = await newShop.save();
    res.status(201).json({ message: 'Shop created successfully', shop: savedShop });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all shops (Public or Admin)
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('owner', 'name email');
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get shop by ID
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update shop (Owner only)
exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    if (!shop) return res.status(404).json({ message: 'Shop not found or unauthorized' });
    res.status(200).json({ message: 'Shop updated successfully', shop });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
