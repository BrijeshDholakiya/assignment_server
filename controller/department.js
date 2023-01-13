const ErrorResponse = require("../utils/errorresponse");
const asyncHandler = require("../middleware/async");
const Department = require("../models/Department");

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
  const department = await Department.findById(req.params.id);

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

  department = await Department.findOneAndUpdate(req.params.id, req.body, {
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
