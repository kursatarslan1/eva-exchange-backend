const express = require('express');
const router = express.Router();
const productController = require('../controllers/product_controller');

router.use(express.json());

router.post('/create', productController.createProduct);
router.get('/getAllProduct', productController.getAllProduct);
router.get('/getProductById', productController.getProductById);
router.get('/getProductByCategory', productController.getProductByCategory);
router.put('/updateProduct', productController.updateProductById);
router.delete('/deleteProduct', productController.deleteProductById);

module.exports = router;