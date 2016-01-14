'use strict';
var taglib = require('tagio');
var a = require('async');
// var p = 0;

process.on('message', function(msg) {
  // console.log(msg);
  if (msg === 1) return process.exit();
  // console.log('Got', msg.length);
  msg.forEach(function(work) {
    let p = 0;
    // let work = msg.pop();
    // console.log(work.length);
    a.forEach(work, function(file, cb) {
      var info = taglib.open(file);
      // info.log();
      // console.log(p);
      cb();
      p++;
    }, function(err) {
      if (err) console.log('Err', err);
      process.send(p);
      // p = 0;
    });

  });

});
