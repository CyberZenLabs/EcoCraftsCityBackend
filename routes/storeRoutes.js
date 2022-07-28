const express = require('express');
const storeController = require('./../controllers/storeController');
const router = express.Router();

router
  .route('/')
  .get(storeController.getAllStores)
  .post(storeController.createStore);

router
  .route('/:id')
  .delete(storeController.deleteStore)
  .get(storeController.getStore)
  .patch(storeController.uploadStoreImages, storeController.updateStore);

module.exports = router;
