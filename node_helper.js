const NodeHelper = require("node_helper");
const http = require("http");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-NASCARStandings helper started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FETCH_NASCAR_STANDINGS") {
            this.fetchStandings(payload);
        }
    },

    fetchStandings: function(apiKey) {
        const url = `http://api.sportradar.com/motorsports/trial/v2/en/series/NASCAR/cup/standings.json?api_key=${apiKey}`;

        http.get(url, res => {
            let data = "";
            res.on("data", chunk => { data += chunk; });
            res.on("end", () => {
                try {
                    const standings = JSON.parse(data);
                    this.sendSocketNotification("NASCAR_STANDINGS_RESULT", standings);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            });
        }).on("error", error => {
            console.error("HTTP request failed:", error);
        });
    }
});
