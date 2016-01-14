'use strict';
var taglib = require('tagio');
var a = require('async');

process.on('message', function(msg) {
  // console.log(msg);
  if (msg === 1) return process.exit();
  console.log('Received work from master');
  var q = a.queue(function (data, cb) {
    console.log('New q with work', data.work.length);
    let tags = [];
    a.forEach(data.work, function(file, cb) {
      // console.log(file);
      try {
        let info = taglib.open(file);
        // tags.push(info.getAll());

      } catch(e) {
        cb(e);
      }
      // info.log();
      cb();
    }, function(err) {
      console.log('Calling back', tags.length);
      if (err) console.log("Error", err);
      // q.pause();
      cb(err, tags);
      // setTimeout(function() {
      //   q.resume();
      // }, 1000);
    });

  }, 1);

  q.drain = function() {
    console.log('all items have been processed');
  }
  // console.log('Got', msg.length);
  msg.forEach(function(work) {
    let p = 0;
    q.push({work: work}, function(err, tags) {
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
