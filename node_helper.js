const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
  start: function () {
    console.log("MMM-NASCARStandings helper started...");
  },

  // Listen for the FETCH_NASCAR_STANDINGS notification from the front-end.
  socketNotificationReceived: function (notification, payload) {
    if (notification === "FETCH_NASCAR_STANDINGS") {
      this.fetchStandings(payload);
    } else {
      console.log("Unhandled notification: " + notification);
    }
  },

  fetchStandings: function (apiKey) {
    const options = {
      method: 'GET',
      hostname: 'api.sportradar.com',
      port: null, // default HTTPS port (443) is used when null or omitted
      path: '/nascar-ot3/mc/2025/standings/drivers.json',
      headers: {
        accept: 'application/json',
        'x-api-key': apiKey // using the provided API key from payload
      }
    };

    // Make the HTTPS request.
    const req = https.request(options, (res) => {
      const chunks = [];
      console.log(`Response status code: ${res.statusCode}`);
      console.log("Response headers:", res.headers);

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const body = Buffer.concat(chunks).toString();
        console.log("Raw response:", body);
        try {
          const data = JSON.parse(body);
          console.log("Parsed standings:", data);
          // Send the data back to the front-end
          this.sendSocketNotification("NASCAR_STANDINGS_RESULT", data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    });

    req.on("error", (error) => {
      console.error("HTTPS request error:", error);
    });

    req.end();
  }
});
