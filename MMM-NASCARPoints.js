Module.register("MMM-NASCARPoints", {
    defaults: {
        url: "https://cf.nascar.com/live/feeds/series_2/5314/live_points.json",
        updateInterval: 86400000 // Default: 24 hours (will adjust dynamically)
    },

    start: function() {
        this.data = null;
        this.checkRaceDay();
    },

    checkRaceDay: function() {
        fetch("https://www.sportingnews.com/us/nascar/schedule") // NASCAR schedule API
            .then(response => response.json())
            .then(schedule => {
                const today = new Date().toISOString().split("T")[0]; // Get today's date
                const raceToday = schedule.some(event => event.date === today);

                if (raceToday) {
                    this.config.updateInterval = 60000; // Refresh every 60 seconds on race days
                } else {
                    this.config.updateInterval = 86400000; // Refresh every 24 hours otherwise
                }

                this.getData();
                setInterval(() => {
                    this.getData();
                }, this.config.updateInterval);
            })
            .catch(error => console.error("Error fetching NASCAR schedule:", error));
    },

    getData: function() {
        fetch(this.config.url)
            .then(response => response.json())
            .then(data => {
                this.data = data.driver_points;
                this.updateDom();
            })
            .catch(error => console.error("Error fetching NASCAR data:", error));
    },

    getDom: function() {
        let wrapper = document.createElement("div");
        if (this.data) {
            wrapper.innerHTML = "<h2>NASCAR Live Standings</h2>";
            this.data.forEach(driver => {
                wrapper.innerHTML += `<p><span class="position">${driver.position}.</span> <strong>${driver.first_name} ${driver.last_name}</strong> | Wins: ${driver.wins} | Points: ${driver.points}</p>`;
            });
        } else {
            wrapper.innerHTML = "Loading data...";
        }
        return wrapper;
    }
});
