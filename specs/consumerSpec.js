'use strict';
var Consumer = require("../consumer");

describe("consumer", function(){
  var consumerMaker;

  beforeEach(function(){
    consumerMaker = function(options){
      return new Consumer(options);
    };
  });

  describe("#constructor", function(){
    describe("with no options", function(){
      it("should not throw", function(){
        expect(consumerMaker).not.toThrow();
      });
    });
    describe("options", function(){
      describe("transport", function(){
        var transport, transportOption;
        beforeEach(function(){
          transport = {};
          transportOption = function(){
            return consumerMaker({
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
      describe("reporter", function(){
        var reporter, reporterOption;
        beforeEach(function(){
          reporter = {};
          reporterOption = function(){
            return consumerMaker({
              reporter: reporter
            });
          };
        });
        it("should not throw", function(){
          expect(reporterOption).not.toThrow();
        });
        it("should set the reporter property on the object", function(){
          expect(reporterOption().reporter).toEqual(reporter);
        });
      });
      describe("interval", function(){
        var interval, intervalOption;
        beforeEach(function(){
          interval = 1000;
          intervalOption = function(){
            return consumerMaker({
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
            return consumerMaker({
              autoStart: autoStart
            });
          };
          spyOn(Consumer.prototype, "start");
        });
        it("should invoke the start method", function(){
          var c = autoStartOption();
          expect(c.start).toHaveBeenCalled();
        });
      });
    });
  });

  describe("#start", function(){
    var consumer;
    beforeEach(function(){
      consumer = consumerMaker();
      spyOn(global, 'setInterval').andReturn(1000);
      spyOn(consumer, 'stop');
    });

    it("should call setInterval", function(){
      consumer.start();
      expect(global.setInterval).toHaveBeenCalled();
    });

    it("should set __i to the result of a setInterval", function(){
      consumer.start();
      expect(consumer.__i).toBe(1000);
    });

    it("should return the consumer", function(){
      expect(consumer.start()).toEqual(consumer);
    });

    describe("when called multiple times consecutively", function(){
      it("should call stop in between each call to start", function(){
        consumer.start();
        consumer.start();
        expect(consumer.stop).toHaveBeenCalled();
      });
    });
  });

  describe("#stop", function(){
    var consumer;
    beforeEach(function(){
      consumer = consumerMaker();
      spyOn(global, 'clearInterval').andReturn(1000);
    });

    it("should call clearInterval with the __i property", function(){
      consumer.stop();
      expect(clearInterval).toHaveBeenCalled();
    });
    it("should set the __i property to null", function(){
      consumer.stop();
      expect(consumer.__i).toBeNull();
    });
    it("should return the consumer", function(){
      expect(consumer.stop()).toEqual(consumer);
    });
  });

  describe("#process", function(){
    var consumer;
    beforeEach(function(){
      consumer = consumerMaker();
      spyOn(consumer.reporter, 'report');
    });

    describe("well formed addition expression", function(){
      it("should call the reporter report method with the correct result", function(){
        consumer.process("3+6=");
        expect(consumer.reporter.report).toHaveBeenCalledWith(9);
      });
      it("should support multiple numbers in the expression", function(){
        consumer.process("3+6+90=");
        expect(consumer.reporter.report).toHaveBeenCalledWith(99);
      });
    });

    describe("Malformed addition expression", function(){
      describe("invalid numeric value", function(){
        it("should report with a useful error message", function(){
          consumer.process("bad numeric value");
          expect(consumer.reporter.report).toHaveBeenCalledWith('Error processing expression :: bad numeric value :: Error - Expected number');
        });
      });
      describe("null value", function(){
        it("should report with a useful error message", function(){
          consumer.process(null);
          expect(consumer.reporter.report).toHaveBeenCalledWith('Error processing expression :: null :: Error - Cannot read property \'replace\' of null');
        });
      });
    });
  });
});