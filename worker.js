var taglib = require('tagio');
var a = require('async');
var p = 0;

process.on('message', function(msg) {
  if (msg === 1) return process.exit();
  a.forEach(msg, function(file, cb) {
    var info = taglib.open(file);
    //info.log();
    cb();
    p++;
  }, function(err) {
    if (err) console.log('Err', err);
    process.send(p);
    p = 0;
  });



});
