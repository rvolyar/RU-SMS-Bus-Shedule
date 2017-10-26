//twilio number = 646-791-4148

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const twilio = require("twilio");
const rutgers = require('nextbusjs').client();
require('dotenv').config();

const MessagingResponse = twilio.twiml.MessagingResponse;

const sid = process.env.SID;
const token = process.env.TOKEN;

const async = require('asyncawait/async');
const await = require('asyncawait/await');

// busName: String
// callback: (Exception, Object) => void
const rutgersRouteConfigURL = 'https://rumobile.rutgers.edu/1/rutgersrouteconfig.txt';
const busRequest = (busName, callback) => {

  request(rutgersRouteConfigURL, (error, response, body) => {
    if (error) {
      console.log('error:', error);
      return;
    }

    if (response.statusCode) {
      //console.log('statusCode:', response);
    }

    rutgers.setAgencyCache(JSON.parse(body), 'rutgers');
    rutgers.routePredict(busName.toLowerCase(), null, callback, 'minutes');
  });
}

console.log("hi! Your app is running!");

const app = express();
app.use(bodyParser());
app.post('/message', function(req, res) {
  const twiml = new MessagingResponse();

  const busName = req.body.Body;
  busRequest(busName, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Message was " + busName);
    console.log(data);
    let formatted ="";
    for(var i in data){
      formatted+=data[i].title + '\n';
      for(var x in data[i].predictions){
        formatted +=data[i].predictions[x] + ",";
      }
       formatted+="\n";
    }
    console.log(formatted);
    twiml.message(`Bus ${busName} :\n` +  formatted);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  });

});


http.createServer(app).listen(process.env.PORT, process.env.IP);
