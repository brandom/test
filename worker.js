var taglib = require('tagio');
var p = 0;

process.on('message', function(msg) {
  if (msg === 1) return process.exit();
  msg.forEach(function(file) {
    var info = taglib.open(file);
    //info.log();
    p++;
  });

  process.send(p);
  p = 0;

});
