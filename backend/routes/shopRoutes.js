const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { verifyToken, isShopOwner } = require('../middleware/auth');

router.post('/', verifyToken, isShopOwner, shopController.createShop);
router.get('/', shopController.getAllShops);
router.get('/:id', shopController.getShopById);
router.put('/:id', verifyToken, isShopOwner, shopController.updateShop);

module.exports = router;
