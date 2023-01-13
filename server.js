const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//connect to database
connectDB();

//Routes file
const department = require("./routes/department");
const auth = require("./routes/auth");
const users = require("./routes/user");

const app = express();

//body-parser
app.use(express.json());

//cookie-parser
app.use(cookieParser());

//dev logging middlware
if (process.env.NODE_ENV == "devlopment") {
  app.use(morgan("dev"));
}

//Enable CORS
app.use(cors());

//Mount routers
app.use("/departments", department);
app.use("/auth", auth);
app.use("/users", users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle Unhandle Rejection
process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error:${err.message}`.red);
  //close server & exit process
  server.close(() => process.exit(1));
});
