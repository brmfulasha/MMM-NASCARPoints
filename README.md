# NASCARPoints

A MagicMirror² module that displays the top 16 NASCAR driver standings.

## Installation

1. Clone the repository to your MagicMirror modules folder:

   ```sh
   git clone https://github.com/brmfulasha/MMM-NASCARPoints.git
   ```

2. Configure the module in `config.js`:

   ```js
   {
     module: "MMM-NASCARPoints",
     position: "top_left",
     config: {
       maxResults: 16
     }
   }
   ```

## Configuration Options

| Option         | Default Value | Description                               |
| -------------- | ------------- | ----------------------------------------- |
| url            | ...           | URL for NASCAR points feed                |
| updateInterval | 86400000      | Update interval in ms                     |
| maxResults     | 16            | Number of drivers to display              |

## Example

![screenshot](screenshot.png)

## License

MIT
