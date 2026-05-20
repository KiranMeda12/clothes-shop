const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isShopOwner } = require('../middleware/auth');

router.post('/', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getCustomerOrders);
router.get('/shop-orders', verifyToken, isShopOwner, orderController.getShopOrders);
router.put('/:id', verifyToken, isShopOwner, orderController.updateOrderStatus);

module.exports = router;
