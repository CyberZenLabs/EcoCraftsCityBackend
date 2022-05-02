const mongoose = require("mongoose");
const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure === true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    returnnext(new AppError("Email and password are required!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) Get the token and check if it exists
  console.log(req.body);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in please log in to get access", 401)
    );
  }
  //2) Validate the token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError("The token belonging to this user no longer exists"),
      401
    );
  }

  const hasChanged = await freshUser.changedPasswordAfter(decoded.iat);
  //4) Check if user changed password after the JWT was issued
  if (hasChanged) {
    return next(
      new AppError("The password has been changed since token issuance", 400)
    );
  }

  req.user = freshUser;

  //grant access to protected route
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array ["admin", "lead-guide"]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do no have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);

  // set the new password if the token has not expired and there is a user

  //update the changed passwod add property for the currntuser

  // log the user in, send the jwt to the client
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id).select("+password");

  if (!req.body.password)
    return next(new AppError("The password is required to update", 403));

  if (req.body.password !== req.body.passwordConfirm)
    return next(new AppError("The passwords do not match", 403));

  const isCorrect = await currentUser.correctPassword(
    req.body.password,
    currentUser.password
  );

  if (!isCorrect) return next(new AppError("The password is incorrect"), 403);

  currentUser.password = req.body.passwordToUpdate;
  currentUser.passwordConfirm = req.body.passwordConfirm;

  await currentUser.save();

  createSendToken(currentUser, 200, res);

  //1) Get user from the collection
  //2) check if the posted password is correct
  //3)if  so update the password
  //4) Logi);n the user  send jwt
});
