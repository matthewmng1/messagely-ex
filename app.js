/** Express app for message.ly. */


const express = require("express");
const app = express();

/** routes */
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const cors = require("cors");
const ExpressError = require("./expressError")
const { authenticateJWT } = require("./middleware/auth");

// allow both form-encoded and json body parsing
app.use(express.json());
// get auth token for all routes

app.use(authenticateJWT);
app.use(express.urlencoded({extended: true}));

// allow connections to all routes from any browser
app.use(cors());


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  let status = err.status || 500;
  if (process.env.NODE_ENV != "test") console.error(err.stack);

  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  })
});


module.exports = app;
