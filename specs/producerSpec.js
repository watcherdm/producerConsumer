'use strict';
var Producer = require("../producer.js");

describe("producer", function(){
  var producerMaker;

  beforeEach(function(){
    producerMaker = function(options){
      return new Producer(options);
    };
  });

  describe("#constructor", function(){
    describe("with no options", function(){
      it("should not throw", function(){
        expect(producerMaker).not.toThrow();
      });
    });
    describe("options", function(){
      describe("transport", function(){
        var transport, transportOption;
        beforeEach(function(){
          transport = {};
          transportOption = function(){
            return producerMaker({
              transport: transport
            });
          };
        });
        it("should not throw", function(){
          expect(transportOption).not.toThrow();
        });
        it("should set the transport property on the object", function(){
          expect(transportOption().transport).toEqual(transport);
        });
      });
      describe("max", function(){
        var max, maxOption;
        beforeEach(function(){
          max = 500;
          maxOption = function(){
            return producerMaker({
              max: max
            });
          };
        });
        it("should not throw", function(){
          expect(maxOption).not.toThrow();
        });
        it("should set the max property on the object", function(){
          expect(maxOption()._getMax()).toEqual(max);
        });
      });
      describe("interval", function(){
        var interval, intervalOption;
        beforeEach(function(){
          interval = 1000;
          intervalOption = function(){
            return producerMaker({
              interval: interval
            });
          };
        });
        it("should not throw", function(){
          expect(intervalOption).not.toThrow();
        });
        it("should set the interval property on the object", function(){
          expect(intervalOption()._getInterval()).toEqual(interval);
        });
      });
      describe("autoStart", function(){
        var autoStart, autoStartOption;
        beforeEach(function(){
          autoStart = true;
          autoStartOption = function(){
            return producerMaker({
              autoStart: autoStart
            });
          };
          spyOn(Producer.prototype, "start");
        });
        it("should invoke the start method", function(){
          var c = autoStartOption();
          expect(c.start).toHaveBeenCalled();
        });
      });
    });
  });

  describe("#start", function(){
    var producer;
    beforeEach(function(){
      producer = producerMaker();
      spyOn(global, 'setInterval').andReturn(1000);
      spyOn(producer, 'stop');
    });

    it("should call setInterval", function(){
      producer.start();
      expect(global.setInterval).toHaveBeenCalled();
    });

    it("should set __i to the result of a setInterval", function(){
      producer.start();
      expect(producer.__i).toBe(1000);
    });

    it("should return the producer", function(){
      expect(producer.start()).toEqual(producer);
    });

    describe("when called multiple times consecutively", function(){
      it("should call stop in between each call to start", function(){
        producer.start();
        producer.start();
        expect(producer.stop).toHaveBeenCalled();
      });
    });
  });

  describe("#stop", function(){
    var producer;
    beforeEach(function(){
      producer = producerMaker();
      spyOn(global, 'clearInterval').andReturn(1000);
    });

    it("should call clearInterval with the __i property", function(){
      producer.stop();
      expect(clearInterval).toHaveBeenCalled();
    });
    it("should set the __i property to null", function(){
      producer.stop();
      expect(producer.__i).toBeNull();
    });
    it("should return the producer", function(){
      expect(producer.stop()).toEqual(producer);
    });
  });

  describe("#produce", function(){
    var producer;
    beforeEach(function(){
      producer = producerMaker();
      spyOn(producer.transport, 'send');
      spyOn(producer, '_getRandomPositiveInteger').andReturn(100);
    });

    it("should call the transport send method with the correct result", function(){
      producer.produce();
      expect(producer.transport.send).toHaveBeenCalledWith("100+100=");
    });
  });
});