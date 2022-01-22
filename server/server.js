const express = require("express");
const app = express();
const db = require("./database");
const port = 3000;
// const passport = require("passport");

// const initializePassport = require("./passportConfig");
// initializePassport(passport);

// db.sync().then(() => console.log("db is ready"));

// CRUD Users table api
app.get("/", (req, res) => {
  console.log("working");
});

app.get("/users", (req, res) => {
  res.render("database.db");
});

app.post("/users", (req, res) => {

});

// CRUD Canvas table api
app.get("/api/canvas/:canvas_id", (req, res) => {
  res.render("database.db");
  var sql = "SELECT * FROM canvas WHERE canvas_id = ?"
  var params = [req.params.canvas_id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": row
    })
  });
});

app.post("/canvas", (req, res) => {
  res.render
})

app.delete("/canvas/:canvas_ID", (req, res) => {
})

// CRUD Pixels table api
app.get("/pixels", (req, res) => {
  res.render("database.db");
});

app.post("/pixels", (req, res) => {
  res.render
})

app.delete("/pixels/:pixels_ID", (req, res) => {

})

// CRUD history table api
app.get("/history", (req, res) => {
  res.render("database.db");
});

app.post("/history", (req, res) => {
  res.render
})


app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});
