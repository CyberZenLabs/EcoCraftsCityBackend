<<<<<<< HEAD
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;

  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.setProductUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;

  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
=======
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  req.body.type = 'tour';
  next();
};
exports.setProductUserIds = (req, res, next) => {
  // Allow nested routes

  if (!req.body.product) req.body.product = req.params.productId;

  if (!req.body.user) req.body.user = req.user.id;
  req.body.type = 'product';

  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.getReviewsForProduct = catchAsync(async (req, res, next) => {
  console.log(req.params.productId);
  const query = Review.find({ product: req.params.productId });

  console.log(query);

  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});
exports.getReviewsForTour = catchAsync(async (req, res, next) => {
  const query = Review.find({ tour: req.params.tourId });

  const doc = await query;
  console.log(query);
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
>>>>>>> 47409b544362711580c35c56796ee46b6976f1b1
