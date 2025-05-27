Module.register("MMM-NASCARStandings", {
  defaults: {
    apiKey: "WEWzA7Wxzu25w7v29YUeT1b6n3Kq4D07N2ZpYcQl", // Your API key
    updateInterval: 3600000,     // Update every hour (in milliseconds)
    maxDrivers: 16,              // Show only the top 16 drivers
    moduleWidth: "400px",        // Module width
    moduleHeight: "60px"         // Module height for scrolling line
  },

  start: function() {
    this.standings = null;
    this.getStandings();
    setInterval(() => {
      this.getStandings();
    }, this.config.updateInterval);
  },

  // Request standings from the Node Helper
  getStandings: function() {
    this.sendSocketNotification("FETCH_NASCAR_STANDINGS", this.config.apiKey);
  },

  // Render as a single-line scrolling ticker
  getDom: function() {
    let wrapper = document.createElement("div");
    wrapper.className = "MMM-NASCARStandings";
    wrapper.style.width = this.config.moduleWidth;
    wrapper.style.height = this.config.moduleHeight;
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "relative";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";

    if (this.standings && this.standings.drivers) {
      // Build a long string with all driver standings
      let standingsText = this.standings.drivers
        .slice(0, this.config.maxDrivers)
        .map(driver => 
          `#${driver.rank || driver.position}: ${driver.full_name} (${driver.points} pts, ${driver.wins || 0} wins)`
        ).join("  |  ");

      // Scrolling div
      let ticker = document.createElement("div");
      ticker.className = "nascar-standings-ticker";
      ticker.textContent = standingsText;

      wrapper.appendChild(ticker);
    } else {
      let loading = document.createElement("p");
      loading.textContent = "Loading standings...";
      wrapper.appendChild(loading);
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
