import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/bug.png';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1 className="navbar-logo">
                    <img src={logo} alt="VirusGuru Logo" style={{ height: '40px' }} />
                    VirusGuru
                </h1>
                <ul className="navbar-links">
                    <li><Link to="/">Scan</Link></li>
                    <li><Link to="/file">File</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
