import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import {
  Element,
  startDrawing,
  finishDrawing,
  addPoint,
  addElement,
  setShapeType,
  setColor,
  setWidth,
  fetchDrawing,
  updateDrawing,
  clearDrawing,
} from './drawingSlice';
import './DrawingTool.css';



const DrawingTool: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { elements, points, drawing, shapeType, color, width } = useSelector(
    (state: RootState) => state.drawing
  );
  const boardID = 'test';

  useEffect(() => {
    dispatch(fetchDrawing(boardID));
  }, [dispatch, boardID]);

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
        color,
        width,
      };
    } else if (shapeType === 'rectangle' && points.length >= 2) {
      newElement = {
        type: 'rectangle',
        points: [points[0], points[points.length - 1]],
        color,
        width,
      };
    } else if (shapeType === 'circle' && points.length >= 2) {
      newElement = {
        type: 'circle',
        points: [points[0], points[points.length - 1]],
        color,
        width,
      };
    } else if (shapeType === 'pencil') {
      newElement = {
        type: 'pencil',
        points: [...points],
        color,
        width,
      };
    } else if (shapeType === 'eraser') {
      newElement = {
        type: 'eraser',
        points: [...points],
        color,
        width,
      };
    }

    if (newElement) {
      dispatch(addElement(newElement));
    }

    dispatch(finishDrawing());
  };

  useEffect(() => {
    if (elements.length > 0) {
      dispatch(updateDrawing({ boardID, elements }));
    }
  }, [elements, dispatch, boardID]);

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Array.isArray(elements)) {
        elements.forEach((element) => {
          ctx.strokeStyle = element.color;
          ctx.lineWidth = element.width;
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
          } else if (element.type === 'eraser') {
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(element.points[0].x, element.points[0].y);
            element.points.forEach((point) => {
              ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
          }
        });
      } else {
        console.error('Elements is not an array:', elements);
      }

      if (points.length > 1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

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
        } else if (shapeType === 'eraser') {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          points.slice(1).forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1;
        }
      }
    }
  }, [elements, points, shapeType, color, width]);

  const handleClearAll = () => {
    dispatch(clearDrawing()); 
    dispatch(updateDrawing({ boardID, elements: [] })); 
  };

  return (
    <div>
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <button onClick={handleClearAll}>Clear All</button>
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
        <button
          className={shapeType === 'eraser' ? 'active' : ''}
          onClick={() => dispatch(setShapeType('eraser'))}
        >
          Eraser
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => dispatch(setColor(e.target.value))}
        />
        <input
          type="number"
          value={width}
          onChange={(e) => dispatch(setWidth(parseInt(e.target.value, 10)))}
          min="1"
        />
      </div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight * 0.9}
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
