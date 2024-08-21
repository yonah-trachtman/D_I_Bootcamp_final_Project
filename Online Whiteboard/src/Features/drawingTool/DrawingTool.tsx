// src/features/drawingTool/DrawingTool.tsx
import React, { useLayoutEffect } from 'react';
import rough from 'roughjs';
import { useDispatch, useSelector } from 'react-redux';
import  RootState  from "../../app/store";
import { startDrawing, finishDrawing, updateElement, setShapeType } from './drawingSlice';

const gen = rough.generator();

const createElement = (x1: number, y1: number, x2: number, y2: number, type: Method) => {
  let roughEle;
  switch (type) {
    case 'line':
      roughEle = gen.line(x1, y1, x2, y2);
      break;
    case 'rectangle':
      roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1);
      break;
    case 'circle':
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      roughEle = gen.circle(x1, y1, radius * 2);
      break;
    default:
      throw new Error(`Unknown type: ${type}`);
  }

  return { x1, y1, x2, y2, roughEle, type };
};

const DrawingTool: React.FC = () => {
  const dispatch = useDispatch();
  const { elements, drawing, shapeType } = useSelector((state: RootState) => state.drawing);

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rc = rough.canvas(canvas);

      elements.forEach((ele) => rc.draw(ele.roughEle));
    }
  }, [elements]);

  const handleStartDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newEle = createElement(x, y, x, y, shapeType);
    dispatch(startDrawing(newEle));
  };

  const handleFinishDrawing = () => {
    dispatch(finishDrawing());
  };

  const handleDraw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedEle = createElement(x1, y1, x, y, shapeType);

    dispatch(updateElement({ index, element: updatedEle }));
  };

  return (
    <div>
      <div>
        <button onClick={() => dispatch(setShapeType('line'))}>Line</button>
        <button onClick={() => dispatch(setShapeType('rectangle'))}>Rectangle</button>
        <button onClick={() => dispatch(setShapeType('circle'))}>Circle</button>
      </div>
      <canvas
        id="canvas"
        width={window.innerWidth / 2}
        height={window.innerHeight / 2}
        onMouseDown={handleStartDrawing}
        onMouseUp={handleFinishDrawing}
        onMouseMove={handleDraw}
        style={{
          border: '2px solid black',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        Canvas
      </canvas>
    </div>
  );
};

export default DrawingTool;
