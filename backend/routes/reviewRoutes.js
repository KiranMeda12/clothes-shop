const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, isShopOwner } = require('../middleware/auth');

router.post('/', verifyToken, reviewController.createReview);
router.get('/product/:productId', reviewController.getProductReviews);
router.put('/:id/hide', verifyToken, reviewController.hideReview); // ShopOwner or Admin

module.exports = router;
