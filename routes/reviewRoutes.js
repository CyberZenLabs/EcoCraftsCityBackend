const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

const {protect, restrictTo} = authController

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    protect,
    restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(protect, reviewController.deleteReview)
  .patch(protect, reviewController.updateReview);

module.exports = router;
