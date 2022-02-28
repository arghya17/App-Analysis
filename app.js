var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var hbs = require("express-handlebars");
var path = require("path");
var routes = require("./server/routes/index");
var mongoose = require("mongoose");

var app = express();
var port = 8000;
var hostname = "localhost";
//middleware
// app.use(express.static(__dirname + "/frontend/dist"));
// app.all("*", function (req, res) {
//   res.status(200).sendFile(__dirname + "/frontend/dist/frontend/index.html");
// });
mongoose.connect("mongodb://127.0.0.1:27017/user-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "views"));
// app.engine(
//   "hbs",
//   hbs.engine({
//     extname: "hbs",
//     defaultLayout: "layout",
//     layoutsDir: __dirname + "/views",
//   })
// );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("common"));

app.use("/", routes);
//uses the routes defined in the router in index.js

// app.get("/", (req, res) => {
//   res.writeHead(200);
//   res.end("Hello");
// });
// app.post("/", (req, res) => {
//   res.send("Post here");
// });
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
