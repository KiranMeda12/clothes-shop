const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

// Place a new order
exports.createOrder = async (req, res) => {
  try {
    const { shopId, products, totalAmount, shippingAddress } = req.body;
    
    // In a real app, verify total amount and check stock
    
    const newOrder = new Order({
      customer: req.user.id,
      shop: shopId,
      products,
      totalAmount,
      shippingAddress
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get customer orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('shop', 'shopName')
      .populate('products.product', 'title images');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get shop orders (ShopOwner only)
exports.getShopOrders = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const orders = await Order.find({ shop: shop._id })
      .populate('customer', 'name email')
      .populate('products.product', 'title');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (ShopOwner)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const shop = await Shop.findOne({ _id: order.shop, owner: req.user.id });
    if (!shop) return res.status(403).json({ message: 'Unauthorized' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.status(200).json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
