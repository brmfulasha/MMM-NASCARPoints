const NodeHelper = require("node_helper");
const fetch = require("node-fetch"); // Ensure you run: npm install node-fetch

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-NASCARPoints node_helper started.");
    },

    getData: function(url) {
        const self = this;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                self.sendSocketNotification("NASCAR_DATA", data.driver_points);
            })
            .catch(error => {
                console.error("Error fetching NASCAR data:", error);
                self.sendSocketNotification("NASCAR_ERROR", { error: "Failed to fetch NASCAR data" });
            });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_NASCAR_DATA") {
            this.getData(payload.url);
        }
    }
});
