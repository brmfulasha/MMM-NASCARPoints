# MMM-NASCARPoints

A [MagicMirror²](https://magicmirror.builders/) module that displays the top 16 NASCAR driver standings.

---

## Features

- Fetches live NASCAR Cup Series driver standings.
- Automatically adjusts update frequency based on race days.
- Customizable number of results displayed.
- Stylish display suitable for MagicMirror².

---

## Installation

1. **Clone the Repository**

   ```sh
   cd ~/MagicMirror/modules
   git clone https://github.com/brmfulasha/MMM-NASCARPoints.git
   ```

2. **Install Dependencies**

   If using `node-fetch`, install it (recommended: v2):

   ```sh
   cd MMM-NASCARPoints
   npm install node-fetch@2
   ```

   _Or, if using native HTTPS, no dependencies are required._

3. **Configure the Module**

   Add the module to your `config/config.js`:

   ```js
   {
     module: "MMM-NASCARPoints",
     position: "top_left", // Choose your preferred position
     config: {
       maxResults: 16 // Number of drivers to display (default 16)
     }
   }
   ```

---

## Configuration Options

| Option         | Default Value | Description                                    |
| -------------- | ------------- | ---------------------------------------------- |
| `url`          | NASCAR API URL| URL for NASCAR points feed                     |
| `updateInterval` | 86400000    | Update interval in ms (auto-adjusts on race day)|
| `maxResults`   | 16            | Number of drivers to display                   |

---

## Usage

- The module will display the top NASCAR Cup drivers.
- On race days, the standings update every minute; otherwise, once a day.
- If there is an error fetching data, an error message will be displayed.

---

## Troubleshooting

- **Module not displaying?**
  - Check the MagicMirror logs and browser console for errors.
  - Make sure dependencies are installed (`npm install node-fetch@2`).
  - Ensure your configuration matches the module name and syntax above.

- **API changes or errors?**
  - NASCAR APIs can change format; report issues on GitHub if the module breaks.

---

## License

MIT License  
© 2025 brmfulasha

---

## Acknowledgements

- [MagicMirror²](https://magicmirror.builders/)
- NASCAR for live data feeds
