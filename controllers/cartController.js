const catchAsync = require('../utils/catchAsync');
const { Cart, Item } = require('../models/cartModel');
const Product = require('../models/productModel');

exports.addToCart = catchAsync(async (req, res, next) => {
  let data = null;
  const { productId } = req.body;
  const userId = req.user._id;
  const quantity = Number.parseInt(req.body.quantity);
  let cart = await Cart.findOne({
    userId
  });
  const productDetails = await Product.findById(productId);
  console.log(cart);
  if (cart) {
    let indexFound = cart.items.findIndex(p => p.productId === productId);
    let total;

    if (indexFound !== -1) {
      cart.items[indexFound].quantity =
        cart.items[indexFound].quantity + quantity;
      cart.items[indexFound].total =
        cart.items[indexFound].quantity * productDetails.price;
      cart.items[indexFound].price = productDetails.price;
      cart.subTotal = cart.items.map(item => (total += item.total));
    } else if (quantity > 0) {
      cart.items.push({
        productId,
        quantity,
        price: productDetails.price,
        total: parseInt(productDetails.price * quantity).toFixed(2)
      });
      cart.subTotal = cart.items
        .map(item => item.total)
        .reduce((acc, curr) => acc + curr);
    } else {
      return res.status(400).json({
        code: 400,
        message: 'Invalid request'
      });
    }
    data = await cart.save();
  } else {
    const cartData = {
      userId,
      items: [
        {
          productId,
          quantity,
          price: productDetails.price,
          total: parseInt(productDetails.price * quantity)
        }
      ],
      subTotal: parseInt(productDetails.price * quantity)
    };
    cart = new Cart(cartData);
    data = await cart.save();
  }
  return res.status(200).send({
    code: 200,
    message: 'Added to cart success!',
    data
  });
});
