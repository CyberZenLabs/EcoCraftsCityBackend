const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews);

router
  .route('/:tourId')
  .get(reviewController.getReviewsForTour)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)
  .post(reviewController.setTourUserIds, reviewController.createReview);

module.exports = router;
