const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    storeBanner: {
      type: String,
      default: 'defaultBanner.png'
    },
    storePhoto: {
      type: String,
      default: 'defaultStore.svg'
    },
    storeName: {
      type: String,
      required: ['Нужно Имя!', true],
      minlength: [2],
      maxlength: [50]
    },
    storeBirthday: {
      type: Date
    },
    storeLocation: {
      type: String
    },
    storeDescription: {
      type: String,
      required: true,
      maxlength: 400,
      minlength: 5
    },
    storeAboutPhotos: {
      type: [String]
    },
    storeProducts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

storeSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'store',
  localField: '_id'
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
