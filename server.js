const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

//Defining routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const post = require("./routes/api/post");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  Passport Middleware
app.use(passport.initialize());

//  Passport Configuration
require("./config/passport")(passport);

// Database Configuration
const db = require("./config/keys").mongoURI;

// Connect to MongoDB using mongoose
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// This is used to use this specific file when the route is requested by user
// E.g.:- trying localhost:5000/api/users
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/post", post);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(process.env.NODE_ENV);
  console.log(`Server running on port: ${port}`);
});
