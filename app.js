var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var hbs = require("express-handlebars");
var path = require("path");
var routes = require("./server/routes/index");
var cors = require("cors");

var app = express();
var port = process.env.PORT || 8000;
var hostname = "localhost";
//middleware

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
//solved cors error
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("common"));

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length"
  );
  next();
});

app.use("/", routes);
//uses the routes defined in the router in index.js

// app.get("/", (req, res) => {
//   res.writeHead(200);
//   res.end("Hello");
// });
// app.post("/", (req, res) => {
//   res.send("Post here");
// });
app.get("/", (req, res) => {
  res.send("server is up");
});
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;
