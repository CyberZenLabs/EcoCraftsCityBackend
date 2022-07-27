const catchAsync = require('../utils/catchAsync');

exports.getCartSession = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  console.log(product);
});
