import React, { useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const gen = rough.generator();

interface Element {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  roughEle: ReturnType<typeof gen.line>;
}

const createElement = (x1: number, y1: number, x2: number, y2: number): Element => {
  const roughEle = gen.line(x1, y1, x2, y2);
  return { x1, y1, x2, y2, roughEle };
};

const DrawingTool: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [drawing, setDrawing] = useState(false);

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rc = rough.canvas(canvas);

      elements.forEach((ele) => rc.draw(ele.roughEle));
    }
  }, [elements]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect(); 

    const x = event.clientX - rect.left; 
    const y = event.clientY - rect.top;  
    setDrawing(true);
    const newEle = createElement(x, y, x, y);
    setElements((state) => [...state, newEle]);
  };

  const finishDrawing = () => {
    setDrawing(false);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect(); 

    const x = event.clientX - rect.left; 
    const y = event.clientY - rect.top;  

    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedEle = createElement(x1, y1, x, y);

    const copyElement = [...elements];
    copyElement[index] = updatedEle;
    setElements(copyElement);
  };

  return (
    <canvas
      id="canvas"
      width={window.innerWidth / 2}
      height={window.innerHeight / 2}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      style={{
        border: '2px solid black',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      Canvas
    </canvas>
  );
};

export default DrawingTool;
