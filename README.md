# Rutgers Bus Times SMS app

Query Rutgers bus arrival predictions via SMS using Twilio.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file with the following values:
   ```ini
   IP=0.0.0.0
   PORT=3000
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   ```
3. Start the server:
   ```sh
   npm start
   ```

## Usage

Configure Twilio to send incoming SMS webhooks to:
```
http://<your-host>:3000/message
```

Send a text message with a bus name (e.g., `LX`, `A`, `B`) and the app will reply with the next arrivals.

![how it works](https://dl2.pushbulletusercontent.com/qKbsxXMNZmXL9bpFYBMWISUN2OhKcpuT/Screenshot_20171027-013820.jpg)
