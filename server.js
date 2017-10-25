//twilio number = 646-791-4148
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

var async = require('asyncawait/async');
var await = require('asyncawait/await');

function busRequest(busName) {
  var dataToReturn;
  request('https://rumobile.rutgers.edu/1/rutgersrouteconfig.txt', function(error, response, body) {
    if (error) {
      console.log('error:', error);
    } // Print the error if one occurred and handle it
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log(body);
    rutgers.setAgencyCache(JSON.parse(body), 'rutgers');
    rutgers.routePredict(busName.toLowerCase(), null, function(err, data) {
      if (err) {
        console.log(err);
      }
      return data;
    }, 'minutes');
  });
}

console.log("hi! Your app is running!");
//busRequest("a");
//busRequest("a", function(data) { console.log(data); });

var app = express();
app.use(bodyParser());
app.post('/message', function(req, res) {
  const twiml = new MessagingResponse();

  var msgBody = req.body.Body;
  console.log("Message was " + msgBody);
  var message = async(function(data) {
     info = await (busRequest(data.toLowerCase()));
    var send = twiml.message('Message Recieved! Bus ' + data + ":\n" +info);
    return send;
  });
  message(msgBody);
 // twiml.message('Message Recieved! Bus ' + msgBody + ":\n" + busRequest(msgBody.toLowerCase(), message(msgBody))); //doesnt work
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});


http.createServer(app).listen(process.env.PORT, process.env.IP);
