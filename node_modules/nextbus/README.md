# nextbus-js
[![npm version](https://img.shields.io/npm/v/nextbus.svg)](https://www.npmjs.com/package/nextbus)
[![Travis CI Build Status](https://travis-ci.org/elliottsj/nextbus-js.svg?branch=master)](https://travis-ci.org/elliottsj/nextbus-js)

Node.js interface to the [NextBus XML Feed](https://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf)

### Installation
```shell
npm install nextbus
```

### Usage
```js
import nextbus from 'nextbus';
// or:
// const nextbus = require('nextbus').default;

const nb = nextbus();
// or:
// const nb = nextbus({
//   host: 'webservices.nextbus.com', // optional; default is shown
//   protocol: 'http:',               // optional; default is shown
// });

nb.getAgencies().then((agencies) => {
  expect(agencies).toEqual([
    {
      regionTitle: 'California-Northern',
      tag: 'actransit',
      title: 'AC Transit',
    },
    {
      regionTitle: 'Maryland',
      tag: 'jhu-apl',
      title: 'APL',
    },
    {
      regionTitle: 'North Carolina',
      tag: 'art',
      title: 'Asheville Redefines Transit',
    },
    // ...
  ]);
});
```
