const ErrorResponse = require("../utils/errorresponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

//post //register user //public // api/v1/auth/register
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, hobbies, gender, email, password, role } =
    req.body || {};

  //create user
  const user = await User.create({
    firstName,
    lastName,
    hobbies,
    gender,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

//post //login user  //public // /auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password
  if (!password || !email) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  //check for user
  const user = await User.findOne({ email })
    .select("+password")
    .populate("department");
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  //if check password match
  const isMatch = user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  sendTokenResponse(user, 200, res);
});

//get //log user out and clear cookie //private // /auth/logout
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

// Desc     //get current logged user
// Access   //Private
// PATH     /auth/me/:id
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

//Get token from model ,create cookie and send response
const sendTokenResponse = (user, statudsCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    maxAge: 2 * 60 * 60 * 1000,
    httpOnly: true,
  };
  const { firstName, lastName, hobbies, gender, role, email, _id } = user;

  res.status(statudsCode).cookie("token", token, options).json({
    success: true,
    token,
    result: { firstName, lastName, hobbies, gender, role, email, _id },
  });
};
