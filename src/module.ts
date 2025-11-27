import {PanelPlugin} from '@grafana/data';
import {SimpleOptions} from './types';
import {SimplePanel} from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
      .addTextInput({
        path: 'imageUrl',
        name: 'Floorplan URL',
        description: 'Full URL of floorplan in image format'
      })
      .addNumberInput({
        path: 'coordinates.topLeft.lat',
        name: 'Top Left Latitude',
        description: 'Latitude of the Top Left image corner',
        category: ['Coordinates']
      })
      .addNumberInput({
        path: 'coordinates.topLeft.long',
        name: 'Top Left Longitude',
        description: 'Longitude of the Top Left image corner',
        category: ['Coordinates']
      })
      .addNumberInput({
        path: 'coordinates.bottomLeft.lat',
        name: 'Bottom Left Latitude',
        description: 'Latitude of the Bottom Left image corner',
        category: ['Coordinates']
      })
      .addNumberInput({
        path: 'coordinates.bottomLeft.long',
        name: 'Bottom Left Longitude',
        description: 'Longitude of the Bottom Left image corner',
        category: ['Coordinates']
      })
      .addNumberInput({
        path: 'coordinates.topRight.lat',
        name: 'Top Right Latitude',
        description: 'Longitude of the Top Right image corner',
        category: ['Coordinates']
      })
      .addNumberInput({
        path: 'coordinates.topRight.long',
        name: 'Top Right Longitude',
        description: 'Longitude of the Top Right image corner',
        category: ['Coordinates']
      })
      .addNumberInput({
        path: 'minElevation',
        name: 'Minimum (Floor) elevation',
        description: 'Elevation of the Floor in m, points below this will be ignored'
      })
      .addNumberInput({
        path: 'maxElevation',
        name: 'Maximum (Ceiling) elevation',
        description: 'Elevation of the Ceiling in m, points above this will be ignored'
      })
      .addNumberInput({
        path: 'destination.lat',
        name: 'Destination Latitude',
        description: 'Latitude of the Destination',
        category: ['Destination']
      })
      .addNumberInput({
        path: 'destination.long',
        name: 'Destination Longitude',
        description: 'Longitude of the Destination',
        category: ['Destination']
      })
      .addNumberInput({
        path: 'destination.elevation',
        name: 'Destination Elevation',
        description: 'Elevation of the Destination in m',
        defaultValue: 0,
        category: ['Destination']
      })
});
