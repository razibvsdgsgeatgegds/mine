import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from 'src/pages/Home';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}