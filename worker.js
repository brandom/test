'use strict';
var taglib = require('tagio');
var a = require('async');
// var p = 0;
var c = 0;

process.on('message', function(msg) {
  // console.log(msg);
  if (msg === 1) return process.exit();
  if (msg.concurrency) return c = msg.concurrency;

  var q = a.queue(function (file, cb) {
    let info = taglib.open(file);
    cb(null, info);
  }, c);

  q.drain = function() {
    console.log('all items have been processed');
  }
  // console.log('Got', msg.length);
  msg.forEach(function(work) {
    let p = 0;
    work.forEach(function(file) {
      q.push(file, function(err) {
        p++;
        if (p === c) {
          process.send(p);
          p = 0;
        }
      });
    })
    // let work = msg.pop();
    // console.log(work.length);
    // work.forEach(function(file, cb) {
    //   var info = taglib.open(file);
    //   // info.log();
    //   // console.log(p);
    //   cb(info.log());
    //   p++;
    // }, function(err, logs) {
    //   if (err) console.log('Err', err);
    //   process.send(p);
    //   // p = 0;
    // });

  });

});
