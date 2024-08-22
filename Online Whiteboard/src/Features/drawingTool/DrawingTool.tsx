import React, { useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { startDrawing, finishDrawing, addPoint, setShapeType, addElement } from './drawingSlice';
import './DrawingTool.css';

interface Point {
  x: number;
  y: number;
}

interface Element {
  type: 'line' | 'rectangle' | 'circle' | 'pencil';
  points: Point[];
}

const DrawingTool: React.FC = () => {
  const dispatch = useDispatch();
  const { elements, points, drawing, shapeType } = useSelector((state: RootState) => state.drawing);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const { left, top } = canvas.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    dispatch(startDrawing());
    dispatch(addPoint({ x, y }));
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const canvas = event.currentTarget;
    const { left, top } = canvas.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;

    dispatch(addPoint({ x, y }));
  };

  const handleMouseUp = () => {
    if (!drawing) return;

    let newElement: Element | null = null;

    if (shapeType === 'line' && points.length >= 2) {
      newElement = {
        type: 'line',
        points: [points[0], points[points.length - 1]],
      };
    } else if (shapeType === 'rectangle' && points.length >= 2) {
      newElement = {
        type: 'rectangle',
        points: [points[0], points[points.length - 1]],
      };
    } else if (shapeType === 'circle' && points.length >= 2) {
      newElement = {
        type: 'circle',
        points: [points[0], points[points.length - 1]],
      };
    } else if (shapeType === 'pencil') {
      newElement = {
        type: 'pencil',
        points: [...points],
      };
    }

    if (newElement) {
      dispatch(addElement(newElement));
    }

    dispatch(finishDrawing());
  };

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);


      elements.forEach((element) => {
        if (element.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          ctx.lineTo(element.points[1].x, element.points[1].y);
          ctx.stroke();
        } else if (element.type === 'rectangle') {
          const x = element.points[0].x;
          const y = element.points[0].y;
          const width = element.points[1].x - x;
          const height = element.points[1].y - y;
          ctx.strokeRect(x, y, width, height);
        } else if (element.type === 'circle') {
          const x1 = element.points[0].x;
          const y1 = element.points[0].y;
          const x2 = element.points[1].x;
          const y2 = element.points[1].y;
          const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          ctx.beginPath();
          ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (element.type === 'pencil') {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          element.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
      });


      if (points.length > 1) {
        if (shapeType === 'line') {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
          ctx.stroke();
        } else if (shapeType === 'rectangle') {
          const x = points[0].x;
          const y = points[0].y;
          const width = points[points.length - 1].x - x;
          const height = points[points.length - 1].y - y;
          ctx.strokeRect(x, y, width, height);
        } else if (shapeType === 'circle') {
          const x1 = points[0].x;
          const y1 = points[0].y;
          const x2 = points[points.length - 1].x;
          const y2 = points[points.length - 1].y;
          const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          ctx.beginPath();
          ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (shapeType === 'pencil') {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          points.slice(1).forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
      }
    }
  }, [elements, points, shapeType]);

  return (
    <div>
    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
      <button
        className={shapeType === 'line' ? 'active' : ''}
        onClick={() => dispatch(setShapeType('line'))}
      >
        Line
      </button>
      <button
        className={shapeType === 'rectangle' ? 'active' : ''}
        onClick={() => dispatch(setShapeType('rectangle'))}
      >
        Rectangle
      </button>
      <button
        className={shapeType === 'circle' ? 'active' : ''}
        onClick={() => dispatch(setShapeType('circle'))}
      >
        Circle
      </button>
      <button
        className={shapeType === 'pencil' ? 'active' : ''}
        onClick={() => dispatch(setShapeType('pencil'))}
      >
        Pencil
      </button>
    </div>
    <canvas
      id="canvas"
      width={window.innerWidth}
      height={window.innerHeight * .9}
      style={{
        border: '2px solid black',
        display: 'block',
        margin: '0 auto',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  </div>
  );
};

export default DrawingTool;
