var fs = require('fs'),
    https = require('https'),
    express = require('express'),
    path = require('path'),
    app = express();

    app.use('/dist',express.static(__dirname + '/dist'));
    app.use('/assets',express.static(__dirname + '/assets'));

    https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }, app).listen(8080);

    app.get('/', function (req, res) {
      res.header('Content-type', 'text/html');
      res.sendFile(path.join(__dirname + '/index.html'));
    });
