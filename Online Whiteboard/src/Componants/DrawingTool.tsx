import React, { useEffect } from 'react';
import rough from "roughjs";

const gen = rough.generator();

const DrawingTool = () => {
  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rc = rough.canvas(canvas);
    const rect = gen.rectangle(100, 200, 200, 300);
    const circle = gen.circle(500, 300, 200);
    const line = gen.line(400, 500, 600, 500);
    
    rc.draw(rect);
    rc.draw(circle);
    rc.draw(line);
  }, []); // Add an empty dependency array to run this effect only once

  return (
    <canvas id='canvas' width={window.innerWidth} height={window.innerHeight}>
      Canvas
    </canvas>
  );
};

export default DrawingTool;