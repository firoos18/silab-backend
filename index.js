const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
require("./helpers/init_mongodb");
const AuthRoute = require("./routes/Auth.route");
const UserRoute = require("./routes/User.route");
const SubjectRoute = require("./routes/Subject.route");
const ClassRoute = require("./routes/Class.route");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  res.send("Hello, it's silab backend");
});
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/subject", SubjectRoute);
app.use("/class", ClassRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
