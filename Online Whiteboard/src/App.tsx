import React from 'react';
import './App.css';
import DrawingTool from './Features/drawingTool/DrawingTool';
// import PencilTool from './components/penciltool';

function App() {
  return (
    <div className='App'>
       <DrawingTool /> 
      {/* //Change this line to <PencilTool /> to render pencil */}
    </div>
  );
}

export default App;