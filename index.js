const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const http = require("http");
require("dotenv").config();
require("./helpers/init_mongodb");
const AuthRoute = require("./routes/Auth.route");
const UserRoute = require("./routes/User.route");
const SubjectRoute = require("./routes/Subject.route");
const ClassRoute = require("./routes/Class.route");
const RoleRoute = require("./routes/Role.route");
const PresenceRoute = require("./routes/Presence.route");
const SelectedSubjectRoute = require("./routes/SelectedSubject.route");

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
app.use("/role", RoleRoute);
app.use("/presence", PresenceRoute);
app.use("/selected-subject", SelectedSubjectRoute);

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

const server = http.createServer(app);

server.setTimeout(6000, (socket) => {
  console.log("Request has timed out");
  socket.end("Request has timed out");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
