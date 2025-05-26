const NodeHelper = require("node_helper");

Module.register("MMM-NASCARStandings", {
    defaults: {
        apiKey: "WEWzA7Wxzu25w7v29YUeT1b6n3Kq4D07N2ZpYcQl", // Store this securely!
        updateInterval: 3600000 // Update every hour
    },

    start: function() {
        this.standings = [];
        this.getStandings();
        setInterval(() => {
            this.getStandings();
        }, this.config.updateInterval);
    },

    getStandings: function() {
        this.sendSocketNotification("FETCH_NASCAR_STANDINGS", this.config.apiKey);
    },

    getDom: function() {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = "<h2>NASCAR Cup Series Standings</h2>";

        if (this.standings && this.standings.drivers) {
            let table = document.createElement("table");
            this.standings.drivers.forEach(driver => {
                let row = document.createElement("tr");
                row.innerHTML = `<td>${driver.position}</td><td>${driver.name}</td><td>${driver.points}</td>`;
                table.appendChild(row);
            });
            wrapper.appendChild(table);
        } else {
            wrapper.innerHTML += "<p>Loading standings...</p>";
        }

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "NASCAR_STANDINGS_RESULT") {
            this.standings = payload;
            this.updateDom();
        }
    }
});
