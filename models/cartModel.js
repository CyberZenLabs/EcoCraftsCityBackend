const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Заказ должен иметь продукт']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Для покупки нужен пользователь']
  },
  price: {
    type: Number,
    required: [true, 'цена']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

bookingSchema.pre(/^find/, function(next) {
    this.populate('product').populate({
        path: 'product',
        select: 'name'
    })
  
})

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
