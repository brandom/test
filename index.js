'use strict';
var walk = require('./walk');

var cluster = require('cluster');

var directory = process.argv[2];

var workers = 2;
var w = [];
var c = [];
var wi = [];
var q = [];
var processed = 0;
var total;
var lastp = 0;

cluster.setupMaster({ exec : "worker.js", });

for (var i = 0; i < workers; i++) {
  let a = i;
  w[i] = cluster.fork();
  c[i] = 0;
  q[i] = [];
  w[i].on('message', function(msg) {
    processed = processed + msg;
    c[a] = c[a] - msg;
    if (c[a] === 0) w[a].send(1);
    // else if (q[a].length > 0) {
    //   let work = q[a].pop();
    //   w[a].send(work);
    // }
    let percent = Math.round(processed/total*100);
    if (percent > lastp) console.log(percent,'%');
    lastp = percent;
  })
}

walk(directory, /.mp3$/, function(err, results) {
  console.log('Chunking', results.length);
  total = results.length;
  var i,j,p,chunk = 10;
  for (i=0, j=results.length, p=-1; i<j; i+=chunk) {
    p++;
    if (p >= w.length) p = 0;
    var work = results.slice(i,i+chunk);
    c[p] = c[p] + work.length;
    q[p].push(work)
  }

  for (var i = 0; i < workers; i++) {
    console.log('Sending worker', i, q[i].length);
    if (q[i].length > 0) {
      // let work = q[i].pop();
      w[i].send(q[i]);
    }
  }

  // cluster.on('message', function(msg) {
  //   console.log('Got msg from worker');
  // })

  cluster.on('exit', function(worker, code, signal) { console.log('worker => with pid: ' + worker.process.pid + ' died - total processed', processed); });
})
