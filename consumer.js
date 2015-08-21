'use strict';

function Consumer (options) {
  if (this instanceof Consumer) {
    this.init(options);
  } else {
    return new Consumer(options);
  }
}

Consumer.prototype = {
  INTERVAL: 50,
  transport: {
    get: function(callback){
      callback("2+2=");
    }
  },
  reporter: {
    report: function(report) {
      console.log(report);
    }
  },
  init: function (options) {
    options = options || {};
    this._setTransport(options.transport);
    this._setReporter(options.reporter);
    this._setInterval(options.interval);
    if (options.autoStart) {
      this.start();
    }
  },
  _setTransport: function(transport) {
    if (transport) {
      this.transport = transport;
    }
    return this;
  },
  _setReporter: function(reporter) {
    if (reporter) {
      this.reporter = reporter;
    }
    return this;
  },
  _setInterval: function(interval) {
    if (interval && !isNaN(interval)) {
      this.INTERVAL = interval;
    }
    return this;
  },
  _getInterval: function(){
    return this.INTERVAL;
  },
  process: function (expression){
    var result;
    try {
      result = expression.replace("=", "").split("+").map(function(value){
        return parseInt(value, 10);
      }).reduce(function(m, n){
        if (isNaN(n)) {
          throw new TypeError("Expected number");
        }
        return m + n;
      }, 0);
    } catch(e) {
      result = "Error processing expression :: " + expression + " :: Error - " + e.message;
    }
    this.reporter.report(result);
  },
  start: function(){
    if (this.__i !== null) {
      this.stop();
    }
    this.__i = setInterval(function(){
      this.transport.get(this.process.bind(this));
    }.bind(this), this._getInterval());
    return this;
  },
  stop: function(){
    clearInterval(this.__i);
    this.__i = null;
    return this;
  }
};

module.exports = Consumer;
