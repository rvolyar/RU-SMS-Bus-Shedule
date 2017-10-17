var twilio = require("twilio");
var http = require("http");
var express = require("express");
require('dotenv').config();
var sid = process.env.SID;
var token = process.env.TOKEN;
console.log("hi");
//console.log(sid +"/n"+  token);