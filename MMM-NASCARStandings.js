Module.register("MMM-NASCARStandings", {
  defaults: {
    apiKey: "WEWzA7Wxzu25w7v29YUeT1b6n3Kq4D07N2ZpYcQl", // Your API key
    updateInterval: 3600000,     // Update every hour (in milliseconds)
    maxDrivers: 16,              // Show only the top 16 drivers
    moduleWidth: "300px",        // Module width
    moduleHeight: "300px"        // Module height
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

  // Build the DOM element for the module with header to the left of the table
  getDom: function() {
    let wrapper = document.createElement("div");
    wrapper.className = "MMM-NASCARStandings";
    wrapper.style.width = this.config.moduleWidth;
    wrapper.style.height = this.config.moduleHeight;

    // Create a flex container for header and table
    let flexContainer = document.createElement("div");
    flexContainer.style.display = "flex";
    flexContainer.style.flexDirection = "row";
    flexContainer.style.alignItems = "flex-start";
    flexContainer.style.gap = "20px";

    // Header element
    let header = document.createElement("h2");
    header.innerHTML = this.data.header || "NASCAR Standings"; // Uses config.js header if provided

    // Table/container
    let tableContainer = document.createElement("div");
    if (this.standings && this.standings.drivers) {
      let table = document.createElement("table");
      let headerRow = document.createElement("tr");
      headerRow.innerHTML = `<td>Rank</td><td>Driver</td><td>Wins</td><td>Points</td>`;
      table.appendChild(headerRow);

      // Only include the top maxDrivers entries
      let driversToShow = this.standings.drivers.slice(0, this.config.maxDrivers);
      driversToShow.forEach(driver => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${driver.rank || driver.position}</td>
                         <td>${driver.full_name}</td>
                         <td>${driver.wins || 0}</td>
                         <td>${driver.points}</td>`;
        table.appendChild(row);
      });
      tableContainer.appendChild(table);
    } else {
      let loading = document.createElement("p");
      loading.textContent = "Loading standings...";
      tableContainer.appendChild(loading);
    }

    // Assemble flex container
    flexContainer.appendChild(header);
    flexContainer.appendChild(tableContainer);
    wrapper.appendChild(flexContainer);

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
