const Product = require('../models/Product');
const Shop = require('../models/Shop');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    // Ensure the user owns the shop they are adding products to
    const shop = await Shop.findOne({ _id: req.body.shopId, owner: req.user.id });
    if (!shop) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this shop.' });
    }

    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all products (with optional filtering by shop or category)
exports.getProducts = async (req, res) => {
  try {
    const { shopId, category } = req.query;
    const filter = {};
    if (shopId) filter.shopId = shopId;
    if (category) filter.category = category;

    const products = await Product.find(filter).populate('shopId', 'shopName');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shopId', 'shopName description');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product (Owner only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const shop = await Shop.findOne({ _id: product.shopId, owner: req.user.id });
    if (!shop) return res.status(403).json({ message: 'Unauthorized' });

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const shop = await Shop.findOne({ _id: product.shopId, owner: req.user.id });
    if (!shop && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
