import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import ShowDetails from './pages/ShowDetails';
import Favorites from './pages/Favorites';


function App() {
  return (
    <Router>
  
       <div className="bg-red-100 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
