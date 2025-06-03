import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ShowDetails from './pages/ShowDetails';
import Favorites from './pages/Favorites';


function App() {
  return (
    <>
    <Router>
  
      <NavBar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      
    </Router>
    </>
  );
}

export default App;
