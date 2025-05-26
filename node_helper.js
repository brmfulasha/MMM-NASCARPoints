const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
  start: function() {
    console.log("MMM-NASCARStandings helper started...");
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "FETCH_NASCAR_STANDINGS") {
      this.fetchStandings(payload);
    } else {
      console.log("Unhandled notification: " + notification);
    }
  },

  fetchStandings: function(apiKey) {
    // Use HTTPS instead of HTTP for a secure connection.
    const url = `https://api.sportradar.com/motorsports/trial/v2/en/series/NASCAR/cup/standings.json?api_key=${apiKey}`;
    
    https.get(url, res => {
      let data = "";
      
      // Log the response status code and headers for debugging.
      console.log(`Response status code: ${res.statusCode}`);
      console.log("Response headers:", res.headers);
      
      res.on("data", chunk => {
        data += chunk;
      });
      
      res.on("end", () => {
        console.log("Received data:", data);  // For debugging if needed
        try {
          const standings = JSON.parse(data);
          this.sendSocketNotification("NASCAR_STANDINGS_RESULT", standings);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    }).on("error", error => {
      console.error("HTTPS request failed:", error);
    });
  }
});
