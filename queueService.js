var Queue = require('./queue'),
  connect = require('connect'),
  http = require('http'),
  bodyParser = require('body-parser'),
  app = connect(),
  port = 9100,
  queue = new Queue();

function startService(){
  app.use(bodyParser.urlencoded());

  app.use(function(req, res, next){
    if (req.method === 'POST') {
      console.log("Enqueued " + req.body.message);
      queue.enqueue(req.body.message);
      return res.end("", 200);
    } else if (req.method === 'GET') {
      return res.end(queue.dequeue(), 200);
    } else {
      console.log("Unknown request");
      return res.end("", 400);
    }
  });

  http.createServer(app).listen(port);
}

if (!module.parent) {
  startService();
} else {
  module.exports = startService;
}