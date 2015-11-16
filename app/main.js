var express = require('express');
var http = require('http');
var Promise = require('bluebird');
var url = require('url');

var app = express();
var browserSync = require('browser-sync').create();
var server = http.createServer(app);
var router = express.Router();

module.exports.url = null;

module.exports.init = function() {
  return Promise.promisify(server.listen, {context: server})(0, 'localhost')
    .then(function() {
      return initBrowserSync();
    }).then(function() {
      module.exports.url = url.format({
        protocol: 'http',
        hostname: server.address().address,
        port: browserSync.getOption('port')
      });

      process.stdout.write(module.exports.url + '\n');
    }).catch(function(err) {
      process.stderr.write(err);
    });
};

function initBrowserSync() {
  return Promise.promisify(browserSync.init, {context: browserSync})({
    server: './app',
    middleware: [app],
    files: 'app',
    notify: false,
    open: false
  });
}

module.exports.deinit = function() {
  server.close();
};

app.use(router);

app.get('/', function(req, res) {
  res.sendfile('app/index.html');
});

require.main === module && module.exports.init();