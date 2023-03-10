const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Please add a department name"],
    },
    categoryName: {
      type: String,
      trim: true,
      required: [true, "Please add a category name"],
    },
    location: {
      type: String,
      trim: true,
      required: [true, "Please add a location"],
    },
    salary: {
      type: Number,
      min: [1, "Salary must be atleast 1"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//For reverse populate with virtual
DepartmentSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "department",
  justOne: false,
});

module.exports = mongoose.model("Department", DepartmentSchema);
