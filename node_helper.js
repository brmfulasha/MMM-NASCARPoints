Module.register("MMM-NASCARPoints", {
    defaults: {
        url: "https://cf.nascar.com/live/feeds/series_2/5314/live_points.json",
        updateInterval: 60000
    },

    start: function() {
        this.data = null;
        this.sendSocketNotification("GET_NASCAR_DATA", { url: this.config.url });
        setInterval(() => {
            this.sendSocketNotification("GET_NASCAR_DATA", { url: this.config.url });
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "NASCAR_DATA") {
            this.data = payload;
            this.updateDom();
        }
    },

    getDom: function() {
        let wrapper = document.createElement("div");
        if (this.data) {
            wrapper.innerHTML = "<h2>NASCAR Live Standings</h2>";
            this.data.forEach(driver => {
                wrapper.innerHTML += `<p><strong>${driver.first_name} ${driver.last_name}</strong> — Position: ${driver.position} | Points: ${driver.points} | Wins: ${driver.wins}</p>`;
            });
        } else {
            wrapper.innerHTML = "Loading data...";
        }
        return wrapper;
    }
});
