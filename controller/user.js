const ErrorResponse = require("../utils/errorresponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc        Get all employees
// @route       GET /users
// @access      Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ role: "employee" });
  res.status(200).json({ success: true, data: users });
});
