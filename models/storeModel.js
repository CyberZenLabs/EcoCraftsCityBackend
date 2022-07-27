const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  storeBanner: {
    type: String,
    default: 'defaultBanner.png'
  },
  storePhoto: {
    type: String,
    default: 'defaultStore.png'
  },
  storeName: {
    type: String,
    required: ['Нужно Имя!', true],
    minlength: [2],
    maxlength: [50],
    required: true
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
  }
});
const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
