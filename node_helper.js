import NodeHelper from "node_helper";

export default NodeHelper.create({
    start: function() {
        console.log("MMM-NASCARPoints node_helper started.");
    },

    getData: async function(url) {
        try {
            const fetch = (await import("node-fetch")).default; // Dynamically import node-fetch
            const response = await fetch(url);
            const data = await response.json();
            this.sendSocketNotification("NASCAR_DATA", data.driver_points);
        } catch (error) {
            console.error("Error fetching NASCAR data:", error);
            this.sendSocketNotification("NASCAR_ERROR", { error: "Failed to fetch NASCAR data" });
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_NASCAR_DATA") {
            this.getData(payload.url);
        }
    }
});
