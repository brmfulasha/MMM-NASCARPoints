Module.register("MMM-NASCARPoints", {
    defaults: {
        url: "https://cf.nascar.com/live/feeds/series_2/5314/live_points.json",
        updateInterval: 60000 // Update every 60 seconds
    },
getStyles: function() {
    return ["MMM-NASCARPoints.css"];
}

    start: function() {
        this.data = null;
        this.getData();
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    },

    getData: function() {
        fetch(this.config.url)
            .then(response => response.json())
            .then(data => {
                this.data = data;
                this.updateDom();
            })
            .catch(error => console.error("Error fetching JSON:", error));
    },

    getDom: function() {
        let wrapper = document.createElement("div");
        if (this.data) {
            wrapper.innerHTML = "<h2>NASCAR Live Points</h2>";
            this.data.forEach(driver => {
                wrapper.innerHTML += `<p>${driver.first_name} ${driver.last_name} - Points: ${driver.points}</p>`;
            });
        } else {
            wrapper.innerHTML = "Loading data...";
        }
        return wrapper;
    }
});
