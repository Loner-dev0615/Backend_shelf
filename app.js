const express = require("express");

const app = express();

// GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD

// create, read , update , DELETE

app.get("/", (req, res) => {
    res.send("this is the about page!");
});

app.post("/Dashboard", (req, res) => {
    res.send("This is my home page on loner dev page load it on!");
});

app.put("/", (req, res) => {
 res.send("Hello World!");
});

app.delete("/", (req, res) => {
  res.send("Hello World!");
});

app.head("/", (req, res) => {
  res.send("Hello World!");
});

//app.listen(9000, () => {
//   console.log("Server started on port 9000");
//});

// IN MEMORY DATA STORE FOR DEMONSTRATION

