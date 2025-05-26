Module.register("MMM-NASCARStandings", {
  defaults: {
    apiKey: "WEWzA7Wxzu25w7v29YUeT1b6n3Kq4D07N2ZpYcQl",
    updateInterval: 3600000,
    maxDrivers: 16,
    moduleWidth: "300px",
    moduleHeight: "300px"
  },

  start: function() {
    this.standings = null;
    this.getStandings();
    setInterval(() => {
      this.getStandings();
    }, this.config.updateInterval);
  },

  // Send a socket notification to the Node Helper to fetch standings
  getStandings: function() {
    this.sendSocketNotification("FETCH_NASCAR_STANDINGS", this.config.apiKey);
  },

  // Build the DOM element for the module
  getDom: function() {
    let wrapper = document.createElement("div");
    wrapper.className = "MMM-NASCARStandings";
    // Apply dimensions from configuration
    wrapper.style.width = this.config.moduleWidth;
    wrapper.style.height = this.config.moduleHeight;

    // Create a header container with an image for the header display.
    let headerContainer = document.createElement("div");
    headerContainer.className = "header-container";

    let headerImage = document.createElement("img");
    // Use the provided URL as the header image source
    headerImage.src = "https://loodibee.com/wp-content/uploads/NASCAR-Cup-Series.png";
    headerImage.alt = "NASCAR Cup Series Standings";
    headerImage.className = "header-image";
    headerContainer.appendChild(headerImage);
    wrapper.appendChild(headerContainer);

    // Process standings data if available
    if (this.standings && this.standings.drivers) {
      let table = document.createElement("table");
      let headerRow = document.createElement("tr");
      headerRow.innerHTML = `<td>Rank</td><td>Driver</td><td>Wins</td><td>Points</td>`;
      table.appendChild(headerRow);

      // Show only the top maxDrivers entries
      let driversToShow = this.standings.drivers.slice(0, this.config.maxDrivers);
      driversToShow.forEach(driver => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${driver.rank || driver.position}</td>
                         <td>${driver.full_name}</td>
                         <td>${driver.wins || 0}</td>
                         <td>${driver.points}</td>`;
        table.appendChild(row);
      });
      wrapper.appendChild(table);
    } else {
      let loading = document.createElement("p");
      loading.innerHTML = "Loading standings...";
      wrapper.appendChild(loading);
    }
    return wrapper;
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "NASCAR_STANDINGS_RESULT") {
      console.log("Received standings on front end:", payload);
      this.standings = payload;
      this.updateDom();
    }
  }
});
