'use strict';
var taglib = require('tagio');
var a = require('async');

process.on('message', function(msg) {
  // console.log(msg);
  if (msg === 1) return process.exit();

  var q = a.queue(function (data, cb) {
    // console.log(data.work);
    a.forEach(data.work, function(file, cb) {
      // console.log(file);
      let info = taglib.open(file);
      cb(null, info);
    }, function(err, tags) {
      cb(err, tags);
    })

  }, 1);

  q.drain = function() {
    console.log('all items have been processed');
  }
  // console.log('Got', msg.length);
  msg.forEach(function(work) {
    let p = 0;
    q.push({work: work}, function(err) {
      process.send(work.length);
    });
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
