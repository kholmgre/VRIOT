var express = require('express')
var path = require('path');
var app = express()
app.set('etag', false);

// var publicPath = path.resolve(__dirname, '\\spyvsspy');

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile('Index.html');
});

app.listen(8080);