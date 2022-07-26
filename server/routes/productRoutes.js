const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', productController.checkID);

// POST /product/234fad4/reviews
// GET /product/234fad4/reviews

router.use('/:productId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(productController.aliasTopProducts, productController.getAllProducts);

router.route('/product-stats').get(productController.getProductStats);
router.route('/monthly-plan/:year').get(
  authController.protect,

  productController.getMonthlyPlan
);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(authController.protect, productController.createProduct);


  
router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,

    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,

    productController.deleteProduct
  );

module.exports = router;
