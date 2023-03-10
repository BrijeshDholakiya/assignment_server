// const ErrorResponse = require("../utils/errorresponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc        Get all employees
// @route       GET /users
// @access      Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { departmentName, categoryName, location, sortBy, sortOrder } =
    req.query || {};
  const queryObj = {};
  if (departmentName) queryObj["department.departmentName"] = departmentName;
  if (categoryName) queryObj["department.categoryName"] = categoryName;
  if (location) queryObj["department.location"] = location;

  const pipeline = [
    {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department",
      },
    },
    {
      $match: queryObj,
    },
    {
      $project: {
        department: 0,
        password: 0,
        __v: 0,
      },
    },
  ];

  if (sortBy && sortOrder) {
    pipeline.push({
      $sort: {
        [sortBy]: +sortOrder,
      },
    });
  }

  let employees = await User.aggregate(pipeline);

  // console.log("employees >>>>> ", employees);
  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees,
  });
});
