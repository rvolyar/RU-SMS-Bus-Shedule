//twilio number = 646-791-4148

const http = require("http");
const express = require("express");
const fetch = require("node-fetch");
const twilio = require("twilio");
const rutgers = require("nextbusjs").client();
require("dotenv").config();

const MessagingResponse = twilio.twiml.MessagingResponse;

const ip = process.env.IP || "0.0.0.0";
const port = process.env.PORT || 3000;

// busName: String
// callback: (Exception, Object) => void
const rutgersRouteConfigURL = "https://rumobile.rutgers.edu/1/rutgersrouteconfig.txt";

const loadRutgersConfig = async () => {
  try {
    const response = await fetch(rutgersRouteConfigURL);
    if (!response.ok) {
      console.error(`Failed to load Rutgers route config: ${response.status} ${response.statusText}`);
      return;
    }
    const body = await response.text();
    rutgers.setAgencyCache(JSON.parse(body), "rutgers"); // only done at the start
  } catch (error) {
    console.error("Error loading Rutgers route config:", error);
  }
};

loadRutgersConfig();

const busRequest = (busName, callback) => {
  rutgers.routePredict(busName.toLowerCase().replace(/\s/g, ""), null, callback, "minutes");
};

console.log("hi! Your app is running!");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('HEY!')
})

app.post('/message', function(req, res) {
  const twiml = new MessagingResponse();

  const busName = typeof req.body.Body === "string" ? req.body.Body.trim() : "";
  if (!busName) {
    twiml.message("Please send a bus name (e.g., LX, A, B).");
    return res.type("text/xml").send(twiml.toString());
  }

  busRequest(busName, (err, data) => {
    if (err) {
      console.log(err);
      if (err.name === "noroute") {
        twiml.message(
          `Invalid Bus Name. Valid bus names: \n` +
            "a, b, c, ee, f, h, lx, rexb, rexl, s, w1, wknd1, wknd2, rbhs"
        );
        return res.type("text/xml").send(twiml.toString());
      }
      return;
    }
    console.log("Message was " + busName);
    console.log(data);

    if (!Array.isArray(data) || data.length === 0) {
      twiml.message(`No prediction data available for ${busName}.`);
      return res.type("text/xml").send(twiml.toString());
    }
    const formatted = data
      .map((route) => {
        if (!route.predictions || route.predictions.length === 0) {
          return `${route.title}\nNo arrivals listed.`;
        }
        return `${route.title}\n${route.predictions.join(", ")}`;
      })
      .join("\n");

    console.log(formatted);
    twiml.message(`Bus ${busName} :\n` + formatted);
    return res.type("text/xml").send(twiml.toString());
  });

});


http.createServer(app).listen(port, ip);
