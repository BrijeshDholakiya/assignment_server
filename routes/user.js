const express = require("express");
const router = express.Router({ mergeParams: true });
// const User = require("../models/User");

const { protect, authorize } = require("../middleware/auth");
// const advancedResults = require("../middleware/advancedResult");

router.use(protect);
router.use(authorize("manager"));

const { getUsers } = require("../controller/user");

router.route("/").get(getUsers);

module.exports = router;
