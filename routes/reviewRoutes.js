const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.setTourUserIds, reviewController.createReview);

router
  .route('/tour/:tourId')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)
  .post(reviewController.setTourUserIds, reviewController.createReview);

router
  .route('/store/:storeId')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)
  .post(reviewController.setStoreUserIds, reviewController.createReview);

module.exports = router;
