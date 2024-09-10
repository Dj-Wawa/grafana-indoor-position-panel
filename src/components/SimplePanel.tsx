import React, {useRef, useEffect, useMemo} from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';

interface Props extends PanelProps<SimpleOptions> {}

interface Coordinate {
  x: number;
  y: number;
}

function scale (number: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const result = (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  //console.log('[' + inMin + ', ' + inMax + '] -> [' + outMin + ', ' + outMax + '] => ' + number + ' -> ' + result);
  return result;
}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, fieldConfig, id }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Memoize the coordinates array to avoid recomputation on every render
  const coordinates: Coordinate[] = useMemo(() => {
    const coords: Coordinate[] = [];

    // Extract coordinates from the datasource, assuming two fields "x" and "y"
    data.series.forEach(series => {
      const xField = series.fields.find(f => f.name.toLowerCase().startsWith("lon"));
      const yField = series.fields.find(f => f.name.toLowerCase().startsWith("lat"));

      if (xField && yField) {
        for (let i = 0; i < xField.values.length; i++) {
          const x = xField.values.get(i) as number;
          const y = yField.values.get(i) as number;
          coords.push({ x, y });
        }
      }
    });

    return coords;
  }, [data.series]); // Only recompute coordinates when the data series changes


  // useEffect to draw the image and the points
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (context && coordinates.length > 0) {
      // Clear the canvas before drawing
      context.clearRect(0, 0, width, height);

      // Draw the image on the canvas
      const img = new Image();
      img.src = options.imageUrl;
      img.onload = () => {
        context.drawImage(img, 0, 0, width, height);
        let canvasX = 0;
        let canvasY = 0;
        // Draw the path between points
        context.beginPath();
        coordinates.forEach((coord, index) => {
          canvasX = scale(coord.x, options.topLeftLong, options.bottomRightLong, 0, width)
          canvasY = scale(coord.y, options.topLeftLat, options.bottomRightLat, 0, height)

          if (index === 0) {
            context.moveTo(canvasX, canvasY); // Start the path at the first point
          } else {
            context.lineTo(canvasX, canvasY); // Draw a line to the next point
          }
        });
        context.strokeStyle = 'red'; // Path color
        context.lineWidth = 2; // Path thickness
        context.stroke(); // Draw the path

        //console.log('drawing path to exit')
        context.beginPath();
        context.moveTo(canvasX, canvasY);
        canvasX = scale(options.destLong, options.topLeftLong, options.bottomRightLong, 0, width)
        canvasY = scale(options.destLat, options.topLeftLat, options.bottomRightLat, 0, height)
        context.lineTo(canvasX, canvasY);
        context.lineWidth = 2;
        context.setLineDash([10, 5]);
        context.stroke();

        // Plot the points on the image
        coordinates.forEach((coord, index) => {// Map the x and y coordinates to the custom bounds
          //const canvasX = ((x - options.topLeftLong) / (options.bottomRightLong - options.topLeftLong)) * width;
          //const canvasY = height - ((y - options.bottomRightLat) / (options.topLeftLat - options.bottomRightLat)) * height;
          const canvasX = scale(coord.x, options.topLeftLong, options.bottomRightLong, 0, width)
          const canvasY = scale(coord.y, options.topLeftLat, options.bottomRightLat, 0, height)
          //console.log('{' + x + ', ' + y + '} => {' + canvasX + ', ' + canvasY + '}');

          context.beginPath();
          const pointRadius = index === coordinates.length - 1 ? 5 : 3; // Make the last point larger
          context.arc(canvasX, canvasY, pointRadius, 0, 2 * Math.PI); // Draw a circle for each point
          context.fillStyle = 'red'; // Set point color
          context.fill();
        });
      };
    }
  }, [options.imageUrl, coordinates, width, height]); // Coordinates will now only trigger the effect if they actually change

  return (
      <div style={{ width, height, position: 'relative' }}>
        {/* Canvas for drawing points */}
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
  );
};
