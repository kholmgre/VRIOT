var express = require('express');
var path = require('path');
const https = require('https');
var app = express()
app.set('etag', false);

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);