'use strict';

function Queue(options){
  if (this instanceof Queue) {
    this.init(options);
  } else {
    return new Queue(options);
  }
}

Queue.prototype = {
  init: function (options){
    this.__queue = [];
  },
  enqueue: function (message){
    this.__queue.push(message);
  },
  dequeue: function (){
    return this.__queue.shift();
  }
};

module.exports = Queue;
