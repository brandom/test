'use strict';
var tagio = require('tagio');
var a = require('async');
var config = {
  binaryDataDirectory: "/tmp",
  binaryDataUrlPrefix: "/attachments",
  binaryDataMethod: tagio.BinaryDataMethod.ABSOLUTE_URL,
  apeSave: false,
  id3v1Save: false,
  id3v1Encoding: tagio.Encoding.UTF8,
  id3v2Save: true,
  id3v2Version: 4,
  id3v2Encoding: tagio.Encoding.UTF8,
  id3v2UseFrameEncoding: false
};

process.on('message', function(msg) {
  // console.log(msg);
  if (msg === 1) return process.exit();
  console.log('Received work from master');
  var q = a.queue(function (data, cb) {
    let tags = [];
    a.forEach(data.work, function(file, cb) {
      // console.log(file);
      try {
        let info = tagio.open(file, config);
        tags.push(info.getTag());
        info = undefined;
        return cb();

      } catch(e) {
        return cb(e);
      }
      // info.log();
    }, function(err) {
      if (err) console.log("Error", err);
      q.pause();
      cb(err, tags);
      let max = 500;
      let min = 50;
      let timeout = Math.random() * (max - min) + min;
      console.log('timeout is now', timeout)
      setTimeout(function() {
        q.resume();
      }, timeout);
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
      tags = undefined;
    });
  });
  msg = undefined;

});
