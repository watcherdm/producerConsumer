'use strict';

function AdditionExpressionProducer(options){
  if (this instanceof AdditionExpressionProducer) {
    this.init(options);
  } else {
    return new AdditionExpressionProducer(options);
  }
}

AdditionExpressionProducer.prototype = {
  MAX_INT: Number.MAX_SAFE_INTEGER / 2,
  INTERVAL: 100,
  transport: {
    send: function(message){
      console.log(message);
    }
  },
  _setMax: function(max){
    if (max && !isNaN(max)) {
      this.MAX_INT = max;
    }
    return this;
  },
  _getMax: function(){
    return this.MAX_INT;
  },
  _setTransport: function(transport) {
    if (transport) {
      this.transport = transport;
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
  init: function (options) {
    options = options || {};
    this._setMax(options.max);
    this._setInterval(options.interval);
    this._setTransport(options.transport);
    if (options.autoStart) {
      this.start();
    }
  },
  _getRandomPositiveInteger: function () {
    return Math.ceil(Math.random() * this._getMax());
  },
  _generateAdditionExpression: function (a, b){
    return a + "+" + b + "=";
  },
  produce: function () {
    this._sendMessage(this._generateAdditionExpression(
      this._getRandomPositiveInteger(),
      this._getRandomPositiveInteger()
    ));
  },
  _sendMessage: function (message){
    console.log("sending message :: " + message);
    this.transport.send(message);
  },
  start: function(){
    if (this.__i !== null) {
      this.stop();
    }
    this.__i = setInterval(this.produce.bind(this), this._getInterval());
    return this;
  },
  stop: function(){
    clearInterval(this.__i);
    this.__i = null;
    return this;
  }
};

module.exports = AdditionExpressionProducer;
