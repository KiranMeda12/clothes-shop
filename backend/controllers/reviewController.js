const Review = require('../models/Review');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

// Add a review
exports.createReview = async (req, res) => {
  try {
    const { productId, shopId, rating, comment } = req.body;
    
    // Check if user already reviewed
    const existing = await Review.findOne({ user: req.user.id, product: productId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      user: req.user.id,
      product: productId,
      shop: shopId,
      rating,
      comment
    });

    await review.save();

    // Update product stats
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, {
      ratings: avgRating,
      numReviews: reviews.length
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isHidden: false })
      .populate('user', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Hide a review (Shop Owner)
exports.hideReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const shop = await Shop.findOne({ _id: review.shop, owner: req.user.id });
    if (!shop && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    review.isHidden = true;
    await review.save();
    res.status(200).json({ message: 'Review hidden' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
