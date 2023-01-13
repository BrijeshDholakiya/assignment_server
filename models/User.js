const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  firstName: {
    type: String,
    required: [true, "Please add a First Name"],
  },
  lastName: {
    type: String,
    required: [true, "Please add a Last Name"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Please Select a gender"],
  },
  hobbies: {
    type: String,
    required: [true, "Please add Hobbies"],
  },
  email: {
    type: String,
    required: [true, "Please add a email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["manager", "employee"],
    default: "employee",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 8,
    maxlength: 20,
    trim: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypt password using bcrypt\
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//sign jwt and retrun
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match user entered password to hashed password in databas
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
