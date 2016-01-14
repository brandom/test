'use strict';
var walk = require('./walk');

var cluster = require('cluster');

var workers = 4;
var w = [];
var c = [];
var wi = [];
var processed = 0;

cluster.setupMaster({ exec : "worker.js", });

for (var i = 0; i < workers; i++) {
  let a = i;
  w[i] = cluster.fork();
  c[i] = 0;
  w[i].on('message', function(msg) {
    processed = processed + msg;
    c[a] = c[a] - msg;
    if (c[a] === 0) w[a].send(1);
  })
}

walk('/Volumes/debra/Music/Bob Dylan', /.mp3$/, function(err, results) {
  console.log(results.length);
  var i,j,p,chunk = 10;
  for (i=0, j=results.length, p=-1; i<j; i+=chunk) {
    p++;
    if (p >= w.length) p = 0;
    var work = results.slice(i,i+chunk);
    c[p] = c[p] + work.length;
    w[p].send(work);
  }

  // for (var i = 0; i < workers; i++) {
  //   w[i].send('1');
  // }

  // cluster.on('message', function(msg) {
  //   console.log('Got msg from worker');
  // })

  cluster.on('exit', function(worker, code, signal) { console.log('worker => with pid: ' + worker.process.pid + ' died - total processed', processed); });
})
