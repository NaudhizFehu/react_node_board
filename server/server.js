var express = require("express");
const port = process.env.PORT || 3001;

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.use("/", require("./routes"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(port, () => console.log("Listening on port " + port));
