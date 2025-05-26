Module.register("MMM-NASCARPoints", {
    defaults: {
        url: "https://cf.nascar.com/live/feeds/series_2/5314/live_points.json",
        updateInterval: 86400000,
        maxResults: 16
    },

    start: function() {
        this.data = null;
        this.error = null;
        this.intervalId = null;
        this.checkRaceDay();
    },

    checkRaceDay: function() {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://www.sportingnews.com/us/nascar/schedule");
        xhr.onload = function() {
            try {
                var schedule = JSON.parse(xhr.responseText);
                var today = new Date().toISOString().split("T")[0];
                var raceToday = Array.isArray(schedule) && schedule.some(function(event) {
                    return event.date === today;
                });
                var interval = raceToday ? 60000 : 86400000;
                self.getData();
                if (self.intervalId) clearInterval(self.intervalId);
                self.intervalId = setInterval(function() {
                    self.getData();
                }, interval);
            } catch (err) {
                console.error("Error processing NASCAR schedule:", err);
                self.error = "Failed to load NASCAR schedule.";
                self.updateDom();
            }
        };
        xhr.onerror = function() {
            console.error("Error fetching NASCAR schedule (network).");
            self.error = "Network error loading NASCAR schedule.";
            self.updateDom();
        };
        xhr.send();
    },

    getData: function() {
        this.sendSocketNotification("GET_NASCAR_DATA", { url: this.config.url });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "NASCAR_DATA") {
            if (Array.isArray(payload)) {
                this.data = payload.slice(0, this.config.maxResults);
                this.error = null;
            } else {
                this.data = null;
                this.error = "Invalid data received from server.";
            }
            this.updateDom();
        } else if (notification === "NASCAR_ERROR") {
            this.data = null;
            this.error = payload && payload.error ? payload.error : "Failed to fetch NASCAR data";
            this.updateDom();
        }
    },

    getStyles: function() {
        return ["MMM-NASCARPoints.css"];
    },

   getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "MMM-NASCARPoints";
    if (this.error) {
        wrapper.innerHTML = "<span class='error'>" + this.error + "</span>";
    } else if (this.data && Array.isArray(this.data)) {
        // Header text
        if (this.config.headerText) {
            var header = document.createElement("div");
            header.innerHTML = this.config.headerText;
            header.style.color = this.config.textColor || "#FFF";
            header.style.fontSize = this.config.textSize === "small" ? "1.2em" : "1.5em";
            wrapper.appendChild(header);
        }

        var list = document.createElement("div");
        list.style.color = this.config.textColor || "#FFF";
        list.style.fontSize = this.config.textSize === "small" ? "0.9em" : "1.2em";

        var drivers = this.data.slice(0, this.config.maxResults || 16);
        // Optionally sort
        if (this.config.sortBy) {
            drivers = drivers.sort((a, b) => a[this.config.sortBy] - b[this.config.sortBy]);
        }
        drivers.forEach((driver) => {
            var p = document.createElement("p");
            var fields = this.config.displayFields || ["position", "full_name", "wins", "points"];
            var text = fields.map(f => driver[f]).join(" | ");
            p.innerHTML = text;
            list.appendChild(p);
        });
        wrapper.appendChild(list);
    } else {
        wrapper.innerHTML = "Loading data...";
    }
    return wrapper;
}
});
