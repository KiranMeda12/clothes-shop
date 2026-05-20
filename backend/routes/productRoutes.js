const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isShopOwner } = require('../middleware/auth');

router.post('/', verifyToken, isShopOwner, productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', verifyToken, isShopOwner, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
