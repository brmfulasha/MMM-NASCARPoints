Module.register("MMM-NASCARPoints", {
    defaults: {
        url: "https://cf.nascar.com/live/feeds/series_2/5314/live_points.json",
        updateInterval: 86400000,
        maxResults: 16
    },

    start: function() {
        this.data = null;
        this.checkRaceDay();
    },

    checkRaceDay: async function() {
        try {
            const response = await fetch("https://www.sportingnews.com/us/nascar/schedule");
            const schedule = await response.json();
            const today = new Date().toISOString().split("T")[0];
            const raceToday = schedule.some(event => event.date === today);

            this.config.updateInterval = raceToday ? 60000 : 86400000;
            this.getData();
            setInterval(() => this.getData(), this.config.updateInterval);
        } catch (error) {
            console.error("Error fetching NASCAR schedule:", error);
        }
    },

    getData: function() {
        this.sendSocketNotification("GET_NASCAR_DATA", { url: this.config.url });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "NASCAR_DATA") {
            this.data = payload.slice(0, this.config.maxResults);
            this.updateDom();
        }
    },

    getStyles: function() {
        return ["MMM-NASCARPoints.css"];
    },

   getDom: function() {
    let wrapper = document.createElement("div");
    if (this.data && Array.isArray(this.data)) {
        wrapper.innerHTML = "<h2>NASCAR Top 16 Standings</h2>";
        const list = document.createElement("ul");
        this.data.forEach(driver => {
            const item = document.createElement("li");
            item.innerHTML = `<span class="position">${driver.position}.</span> <strong>${driver.first_name} ${driver.last_name}</strong> | Wins: ${driver.wins} | Points: ${driver.points}`;
            list.appendChild(item);
        });
        wrapper.appendChild(list);
    } else if (this.error) {
        wrapper.innerHTML = `<span class="error">${this.error}</span>`;
    } else {
        wrapper.innerHTML = "Loading data...";
    }
    return wrapper;
}
});
