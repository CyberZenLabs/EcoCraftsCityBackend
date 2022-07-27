
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');

const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const bookingRouter = require('./routes/bookingRoutes');
const productRouter = require('./routes/productRoutes');

const productReviewRouter = require('./routes/productReviewRoutes');
const tourReviewRouter = require('./routes/tourReviewRoutes');

const app = express();
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');

  res.header('Access-Control-Allow-Headers', '*');
  res.header(
    'Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use(cors());
app.options('*', cors());
app.enable('trust proxy');

// const headers = (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, OPTIONS, PUT, PATCH, DELETE'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     '*'
//   );
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// };
// app.use(headers());
// 1) GLOBAL MIDDLEWARES
// Serving static files

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tour-reviews', tourReviewRouter);
app.use('/api/v1/product-reviews', productReviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/store', storeRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

