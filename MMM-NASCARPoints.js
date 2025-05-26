Module.register("MMM-NASCARPoints", {
    defaults: {
        updateInterval: 86400000,
        maxResults: 16
    },

    start: function() {
        this.data = null;
        this.error = null;
        this.intervalId = null;
        this.fetchSportradarData(); // Fetch data from Sportradar API
    },

    fetchSportradarData: function() {
        const http = require('https');

        const options = {
            method: 'GET',
            hostname: 'api.sportradar.com',
            port: null,
            path: '/nascar-ot3/mc/2025/standings/drivers.json',
            headers: {
                accept: 'application/json',
                'x-api-key': 'WEWzA7Wxzu25w7v29YUeT1b6n3Kq4D07N2ZpYcQl'
            }
        };

        const req = http.request(options, function(res) {
            const chunks = [];

            res.on('data', function(chunk) {
                chunks.push(chunk);
            });

            res.on('end', function() {
                const body = Buffer.concat(chunks);
                console.log('Sportradar Data:', body.toString());
                // You can further process or update the DOM here if needed
            });
        });

        req.on('error', function(e) {
            console.error('Error fetching Sportradar data:', e.message);
        });

        req.end();
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
            // Driver rendering logic
        });
    }
    return wrapper;
   }
});
