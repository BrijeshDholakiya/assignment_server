const ErrorResponse = require("../utils/errorresponse");
const asyncHandler = require("../middleware/async");
const Department = require("../models/Department");
const User = require("../models/User");

// @desc        Get all departments
// @route       GET /departments
// @access      Private
exports.getDepartments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc        Get department by ID
// @route       GET /departments/:id
// @access      Private
exports.getDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.id).populate("users");

  if (!department) {
    return next(
      new ErrorResponse(`Department not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: department });
});

// @desc        Create department
// @route       POST /departments
// @access      Private
exports.createDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.create(req.body);

  res.status(201).json({ success: true, data: department });
});

// @desc        Update department
// @route       PUT /departments/:id
// @access      Private
exports.updateDepartment = asyncHandler(async (req, res, next) => {
  let department = await Department.findById(req.params.id);
  if (!department) {
    return next(
      new ErrorResponse(`Department not found with id of ${req.params.id}`, 404)
    );
  }

  let body = req.body;

  if (req?.body?.users) {
    const userIds = req.body.users;
    const { users, ...rest } = req.body || {};
    body = rest;

    User.updateMany(
      { _id: { $in: userIds } },
      { department: req.params.id },
      function (err, result) {
        if (err) console.log("error in updating User's Department ::: ", err);
      }
    );
  }

  department = await Department.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: department });
});

// @desc        Delete department
// @route       DELETE /departments/:id
// @access      Private
exports.deleteDepartment = asyncHandler(async (req, res, next) => {
  const department = await Department.findById(req.params.id);
  if (!department) {
    return next(
      new ErrorResponse(`Department not found with id of ${req.params.id}`, 404)
    );
  }

  department.remove();
  res.status(200).json({ success: true, data: {} });
});
