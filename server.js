var twilio = require("twilio");
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
require('dotenv').config();
var sid = process.env.SID;
var token = process.env.TOKEN;
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var request = require("request");
var rutgers = require('nextbusjs').client();
function busRequest(busName){
request('https://rumobile.rutgers.edu/1/rutgersrouteconfig.txt', function(error, response, body){
   console.log('error:', error); // Print the error if one occurred and handle it
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //console.log(body);
      rutgers.setAgencyCache(JSON.parse(body),'rutgers');
      rutgers.routePredict(busName, null, function (err, data){
        console.log(err);
        console.log(data);
        return data;
      }, 'minutes');
});
}

console.log("hi! Your app is running!");
//console.log(sid +"/n"+  token);
var app = express();
app.use(bodyParser());
app.post('/message', function(req, res) {
  const twiml = new MessagingResponse();
 
  var msgBody = req.body.Body;
  console.log("Message was " + msgBody);
  twiml.message('Message Recieved! Message was:' + msgBody );
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


http.createServer(app).listen(process.env.PORT, process.env.IP);