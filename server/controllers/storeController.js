const Store = require('../models/storeModel');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const factory = require('./handlerFactory');
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/stores');
  },
  filename: (req, file, cb) => {
    console.log(file);

    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${'test'}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadStoreImages = upload.fields([
  { name: 'storeBanner', maxCount: 1 },
  { name: 'storePhoto', maxCount: 1 },
  { name: 'storeAboutPhotos', maxCount: 15 }
]);

exports.saveStoreImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  console.log(req.files);

  // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  next();
});

exports.updateStore = catchAsync((req, res, next) => {
  console.log('aaa');
  res.send({
    hello: req.files
  });
});

exports.getAllStores = factory.getAll(Store);
exports.getStore = factory.getOne(Store, { path: 'reviews' });
exports.createStore = factory.createOne(Store);
exports.updateStore = factory.updateOne(Store);
exports.deleteStore = factory.deleteOne(Store);
