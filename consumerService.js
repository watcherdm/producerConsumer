var Consumer = require("./consumer"),
  request = require("request"),
  _ = require("underscore"),
  queueUrl = "http://localhost:9100",
  transport = {
    get: function(cb){
      request.get(queueUrl, function(err, res, message){
        if (!message) {
          return;
        }
        console.log(message);
        cb(message);
      });
    }
  };

function startService(options){
  var o = _.extend({}, {
    transport: transport,
    autoStart: true
  }, options);
  return new Consumer(o);
}

if (!module.parent) {
  startService();
} else {
  module.exports = startService;
}