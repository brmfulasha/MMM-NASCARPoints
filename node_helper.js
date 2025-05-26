const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
  start: function () {
    console.log("MMM-NASCARStandings helper started...");
  },

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
      port: null,  // Default HTTPS port (443) will be used
      path: '/nascar-ot3/mc/2025/standings/drivers.json',
      headers: {
        accept: 'application/json',
        'x-api-key': apiKey
      }
    };

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
          // Filter the drivers array to only include the top 16 drivers.
          if (data && Array.isArray(data.drivers)) {
            data.drivers = data.drivers.slice(0, 16);
          } else {
            console.error("No drivers array found in API response");
          }
          console.log("Filtered standings (top 16 drivers):", data);
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
