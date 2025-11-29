import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UrlScanner from './components/UrlScanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import ComingSoon from './components/ComingSoon';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<UrlScanner />} />
            <Route path="/file" element={<ComingSoon />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
