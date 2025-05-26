
Module.register("MMM-NASCARStandings", {
  // Default configuration options
  defaults: {
    apiKey: "WEWzA7Wxzu25w7v29YUeT1b6n3Kq4D07N2ZpYcQl", // Use environment variables in production
    updateInterval: 3600000 // Update every hour (in milliseconds)
  },

  start: function() {
    this.standings = null;
    this.getStandings();
    setInterval(() => {
      this.getStandings();
    }, this.config.updateInterval);
  },

  // Trigger the Node Helper to fetch data via an HTTP GET call
  getStandings: function() {
    this.sendSocketNotification("FETCH_NASCAR_STANDINGS", this.config.apiKey);
  },

  // Build the MagicMirror DOM elements based on the fetched data
  getDom: function() {
    let wrapper = document.createElement("div");
    wrapper.className = "MMM-NASCARStandings";
    wrapper.innerHTML = "<h2>NASCAR Cup Series Standings</h2>";

    if (this.standings && this.standings.drivers) {
      let table = document.createElement("table");
      // Create a header row for clarity
      let headerRow = document.createElement("tr");
      headerRow.innerHTML = `<td>Pos</td><td>Driver</td><td>Points</td>`;
      table.appendChild(headerRow);

      // Loop through the `drivers` array and create table rows
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

  // Update the module when receiving new data from the Node Helper
  socketNotificationReceived: function(notification, payload) {
    if (notification === "NASCAR_STANDINGS_RESULT") {
      this.standings = payload;
      this.updateDom();
    }
  }
});
