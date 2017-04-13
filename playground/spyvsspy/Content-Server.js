var express = require('express')
var path = require('path');
var app = express()
app.set('etag', false);

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/Index.html'));
});

app.listen(8080);