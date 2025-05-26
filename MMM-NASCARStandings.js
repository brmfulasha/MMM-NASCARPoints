Module.register("MMM-NASCARStandings", {
  defaults: {
    apiKey: "WEWzA7Wxzu25w7v29YUeT1b6n3Kq4D07N2ZpYcQl", // In production, secure this key via environment variables.
    updateInterval: 3600000 // Update every hour (milliseconds)
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

  // Build the DOM element that displays the standings
  getDom: function() {
    let wrapper = document.createElement("div");
    wrapper.className = "MMM-NASCARStandings";
    wrapper.innerHTML = "<h2>NASCAR Cup Series Standings</h2>";

    // Check if standings are available and if the API has an array called drivers.
    if (this.standings && this.standings.drivers) {
      let table = document.createElement("table");
      
      // Create and append the table header row (with Rank, Driver, Wins, Points)
      let headerRow = document.createElement("tr");
      headerRow.innerHTML = `<td>Rank</td><td>Driver</td><td>Wins</td><td>Points</td>`;
      table.appendChild(headerRow);

      // Loop through the drivers array and display data accordingly.
      // We use driver.rank or fallback to driver.position if rank isn't defined.
      // Now include driver.wins for the Wins column.
      this.standings.drivers.forEach(driver => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${driver.rank || driver.position}</td>
                         <td>${driver.full_name}</td>
                         <td>${driver.wins || 0}</td>
                         <td>${driver.points}</td>`;
        table.appendChild(row);
      });
      wrapper.appendChild(table);
    } else {
      wrapper.innerHTML += "<p>Loading standings...</p>";
    }
    return wrapper;
  },

  // Listen for data from the Node Helper and update the DOM accordingly
  socketNotificationReceived: function(notification, payload) {
    if (notification === "NASCAR_STANDINGS_RESULT") {
      console.log("Received standings on front end:", payload); // Debug log
      this.standings = payload;
      this.updateDom();
    }
  }
});
