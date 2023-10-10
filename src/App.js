import React from 'react'; 
import './App.css'; 
import Navbar from './components'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './pages/home'; 
import About from './pages/about'; 
import Guide from './pages/guide'; 
import Maps from './pages/maps';
import Blockers from './pages/blockers';


function App() { 
  return ( 
    <Router> 
      <Navbar /> 
      <Routes> 
        <Route path='/' element={<Home />} /> 
        <Route path='/home' element={<Home />} /> 
        <Route path='/about' element={<About />} /> 
        <Route path='/guide' element={<Guide />} /> 
        <Route path='/blockers' element={<Blockers />} /> 
        <Route path='/maps' element={<Maps />} /> 
      </Routes> 
    </Router> 
  ); 
} 

export default App; 
