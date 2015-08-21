var Producer = require("./producer"),
  request = require("request"),
  _ = require("underscore"),
  queueUrl = "http://localhost:9100",
  transport = {
    send: function(message){
      request.post(queueUrl, {form: {message: message}});
    }
  };

function startService(options) {
  var o = _.extend({}, {
    transport: transport,
    autoStart: true,
    max: 100
  }, options || {});
  return new Producer(o);
}

if (!module.parent) {
  startService();
} else {
  module.exports = startService;
}