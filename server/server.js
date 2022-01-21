const express = require("express");
const app = express();
const db = require("./database");
const port = 3000;
const passport = require("passport");

// const initializePassport = require("./passportConfig");
// initializePassport(passport);

// db.sync().then(() => console.log("db is ready"));

app.get("/", (req, res) => {
  console.log("working");
});

app.get("/users", (req, res) => {
  res.render("test.db");
});

app.get("/canvas", (req, res) => {
  res.render("test.db");
});

app.post("/users", (req, res) => {});

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
