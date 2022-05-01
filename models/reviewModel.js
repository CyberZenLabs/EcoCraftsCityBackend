const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'The review is required']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
reviewSchema.index({tour: 1, user: 1}, {unique: true})

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

reviewSchema.statics.calcAvergeRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);


  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingAverage: 4.5
    })
  }
};

reviewSchema.post('save', function() {
  //this points to currennt review
  this.constructor.calcAvergeRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.review = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function(next) {
  //this.review = await this.findOne(); WONT WORK QUERY HAS EXECUTED
  await this.review.constructor.calcAvergeRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

//POST /tour/12312/reviews
//GET /tour/123412/reviews/12931039
