import React, {useEffect, useMemo, useRef} from 'react';
import {PanelProps} from '@grafana/data';
import {SimpleOptions} from 'types';

interface Props extends PanelProps<SimpleOptions> {}

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, fieldConfig, id }) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  console.log(width, height)

  // Memoize the coordinate array to avoid recomputation on every render
  const coordinates: Coordinate[] = useMemo(() => {
    const coords: Coordinate[] = [];

    // Extract coordinates from the datasource, assuming the fields "lat", "lon" and "elv"
    data.series.forEach(series => {
      const xField = series.fields.find(f => f.name.toLowerCase().startsWith("lon"));
      const yField = series.fields.find(f => f.name.toLowerCase().startsWith("lat"));
      const elvField = series.fields.find(f => f.name.toLowerCase().startsWith("elv"));

      if (xField && yField ) {
        for (let i = 0; i < xField.values.length; i++) {
          const x = xField.values[i] as number;
          const y = yField.values[i] as number;
          const z = (elvField?.values[i] as number) ?? 0;
          coords.push({ x, y, z });
        }
      }
    });

    return coords;
  }, [data.series]); // Only recompute coordinates when the data series changes


  // useEffect to draw the image and the points
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    // Early return if there is nothing to draw
    if (!context || coordinates.length === 0) {
      return;
    }

    // Encapsulate scaling logic to avoid repetition
    const toCanvasPoint = (x: number, y: number, z: number, width: number, height: number, offsetX: number, offsetY: number) => {

      const A = options.coordinates.topLeft;
      const B = options.coordinates.topRight;
      const C = options.coordinates.bottomLeft;

      const v1 = {x: B.long - A.long, y: B.lat - A.lat};
      const v2 = {x: C.long - A.long, y: C.lat - A.lat};
      const w = {x: x - A.long, y: y - A.lat};

      const det = v1.x * v2.y - v2.x * v1.y;
      if (Math.abs(det) < 1e-12) {
        throw new Error("Parallelogram is degenerate (points almost collinear)");
      }

      // Solve for u and v using Cramer's rule
      const u = (w.x * v2.y - v2.x * w.y) / det;
      const v = (v1.x * w.y - w.x * v1.y) / det;

      // Rectangle coordinates
      let result_x = u * width + offsetX;
      let result_y = v * height + offsetY;
      let draw = z <= options.maxElevation && z >= options.minElevation;
      //let draw = true;

      console.log(x, y, result_x, result_y)

      return {x: result_x, y: result_y, draw: draw};
    }


    function calculateImageDimensions() {
      // Calculate dimensions to maintain aspect ratio
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = width / height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas - fit to width
        drawWidth = width;
        drawHeight = width / imgAspectRatio;
        offsetX = 0;
        offsetY = (height - drawHeight) / 2;
      } else {
        // Image is taller than canvas - fit to height
        drawHeight = height;
        drawWidth = height * imgAspectRatio;
        offsetX = (width - drawWidth) / 2;
        offsetY = 0;
      }
      return {drawWidth, drawHeight, offsetX, offsetY};
    }

    const renderScene = () => {



      // Clear and draw background
      context.clearRect(0, 0, width, height);

      let {drawWidth, drawHeight, offsetX, offsetY} = calculateImageDimensions();

      // Draw background image with aspect ratio preserved
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      console.log('Top Left: ' + toCanvasPoint(options.coordinates.topLeft.long, options.coordinates.topLeft.lat, 0, drawWidth, drawHeight, offsetX, offsetY))
      console.log('Top Right: ' + toCanvasPoint(options.coordinates.topRight.long, options.coordinates.topRight.lat, 0, drawWidth, drawHeight, offsetX, offsetY))
      console.log('Bottom Left: ' + toCanvasPoint(options.coordinates.bottomLeft.long, options.coordinates.bottomLeft.lat, 0, drawWidth, drawHeight, offsetX, offsetY))
      console.log('Destination: ' + toCanvasPoint(options.destination.long, options.destination.lat, options.destination.elevation, drawWidth, drawHeight, offsetX, offsetY))

      // Pre-calculate canvas points
      const points = coordinates.map((c) => toCanvasPoint(c.x, c.y, c.z, drawWidth, drawHeight, offsetX, offsetY));

      // Draw the path between points
      context.beginPath();
      let lastPointDrawn = false;
      points.forEach((p, i) => {
        if (p.draw){
          if (lastPointDrawn) {
            context.lineTo(p.x, p.y);
          } else {
            context.moveTo(p.x, p.y);
          }
          lastPointDrawn = true;
        } else {
          lastPointDrawn = false;
        }

      });
      context.strokeStyle = 'red';
      context.lineWidth = 2;
      context.setLineDash([]); // Ensure solid line
      context.stroke();

      // Draw the path to exit (dashed)
      const lastPoint = points[points.length - 1];
      const destPoint = toCanvasPoint(options.destination.long, options.destination.lat, options.destination.elevation, drawWidth, drawHeight, offsetX, offsetY);

      context.beginPath();
      context.moveTo(lastPoint.x, lastPoint.y);
      context.lineTo(destPoint.x, destPoint.y);
      context.lineWidth = 2;
      context.setLineDash([10, 5]);
      context.stroke();

      // Plot the points on the image
      points.forEach((p, index) => {
        if(p.draw){
          context.beginPath();
          const pointRadius = index === points.length - 1 ? 5 : 3; // Make the last point larger
          context.arc(p.x, p.y, pointRadius, 0, 2 * Math.PI);
          context.fillStyle = 'red';
          context.fill();
        }
      });
    };

    const img = new Image();
    img.src = options.imageUrl;
    img.onload = renderScene;
  }, [options.imageUrl, coordinates, width, height]); // Coordinates will only trigger the effect if they actually change

  return (
      <div style={{ width, height, position: 'relative' }}>
        {/* Canvas for drawing points */}
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
  );
};
