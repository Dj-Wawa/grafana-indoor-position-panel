# Grafana Indoor Position Panel

A Grafana plugin for displaying indoor position data.

## Installation

### Pre-packaged plugin
Download the latest o5g-indoorpsition-panel-x.x.x.zip from the 
[releases page](https://github.com/Dj-Wawa/grafana-indoor-position-panel/releases) and unzip the contents into your 
Grafana plugins directory (default: `/var/lib/grafana/plugins/`). For more information visit the 
[Grafana documentation](https://grafana.com/docs/grafana/latest/administration/plugin-management/plugin-install/#install-a-plugin-from-a-zip-file).

Restart the Grafana server.

### Build from source
Clone the repository and run `npm install` and `npm run build`. 
Then copy the contents of the `dist` folder into your Grafana plugins directory and restart Grafana.  
This repo also contains a docker image for easy development. To use it, run `npm install`, `npm run build` and `npm run server`.

## Usage

### Configuration
The panel requires an image of a floor plan (or any other map) hosted on any url accessible by the users' browser.  
For buildings with multiple floors, use a separate panel with a different floor plan image for each floor.  
To position data points on the plan you also need to specify the coordinates for the Top Left, Top Right and Bottom Left 
corner of the plan image as well as the minimum (floor) and maximum (ceiling) elevation of the floor in this panel.
To draw a marker for the exit and a line from the most recent position to the exit, also specify the coordinates and elevation of the exit.

### Required data
The plugin expects the following data in the query response:
- `lat` (float)
- `lon` (float)
- `elv` (float)

Data points need to contain all three fields to be displayed.

## Development
This plugin is based on the grafana panel plugin template. Information on how to use it can be found in [DEVELOPMENT.md](./DEVELOPMENT.md). 
All new or modified source code is in the `src` folder. 