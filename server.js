const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Database configuration
const db = require("./config/keys").mongoURI;

// Connection to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected!!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello world"));

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process?.ENV?.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
