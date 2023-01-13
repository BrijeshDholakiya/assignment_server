const express = require("express");

const {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
} = require("../controller/department");

const Department = require("../models/Department");
const advancedResults = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("manager"));

router
  .route("/")
  .get(advancedResults(Department, "users"), getDepartments)
  .post(createDepartment);

router
  .route("/:id")
  .get(getDepartment)
  .put(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;
