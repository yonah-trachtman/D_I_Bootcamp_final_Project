// import React, { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import DrawingTool from './Features/drawingTool/DrawingTool';
import LoginRegister from "./components/LoginRegister"
import Header from './components/Header';


function App() {



  return (
    <>
    <Header/>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path='/login' element={<LoginRegister title={"Login"} />} />
        <Route path='/register' element={<LoginRegister title={"Register"} />} />
        <Route path='/whiteboard' element={<DrawingTool  />} />
      </Routes>

    </>
  );
}

export default App;