const express = require('express');
const productController = require('../controllers/productController');

const authController = require("../controllers/authController");

const router = express.Router();

// router.param('id', checkID);

const {aliasTopProducts,  getProductStats, getMonthlyPlan, getAllProducts, createProduct, getProduct, updateProduct, deleteProduct} = productController;
router
  .route('/top-5-cheap')
  .get(aliasTopProducts, getAllProducts);

router.route('/product-stats').get(getProductStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, getAllProducts)
  .post(createProduct);

router
  .route('/:id')
  .get(getProduct)
  .patch(updateProduct)
  .delete(authController.protect, authController.restrictTo("admin", "lead-guides"), deleteProduct);

module.exports = router;
