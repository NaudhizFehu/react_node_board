var express = require('express');
const port = process.env.PORT || 5000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port, () => console.log('Listening on port ' + port));