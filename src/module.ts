import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'imageUrl',
      name: 'Floorplan URL',
      description: 'Full URL of floorplan (svg)'
    })
      .addNumberInput({
          path: 'topLeftLat',
          name: 'Top Left Latitude',
          description: 'Latitude of the Top Left image corner'
      })
      .addNumberInput({
          path: 'topLeftLong',
          name: 'Top Left Longitude',
          description: 'Longitude of the Top Left image corner'
      })
      .addNumberInput({
          path: 'bottomRightLat',
          name: 'Bottom Right Latitude',
          description: 'Longitude of the Bottom Right image corner'
      })
      .addNumberInput({
          path: 'bottomRightLong',
          name: 'Bottom Right Longitude',
          description: 'Longitude of the Bottom Right image corner'
      })
      .addNumberInput({
          path: 'destLat',
          name: 'Destination Latitude',
          description: 'Latitude of the Destination'
      })
      .addNumberInput({
          path: 'destLong',
          name: 'Destination Longitude',
          description: 'Longitude of the Destination'
      })
});
