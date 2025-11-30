import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/bug.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo-link" style={{ textDecoration: 'none' }}>
                    <h1 className="navbar-logo">
                        <img src={logo} alt="VirusGuru Logo" style={{ height: '40px' }} />
                        VirusGuru
                    </h1>
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isOpen ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    )}
                </div>

                <ul className={isOpen ? "navbar-links active" : "navbar-links"}>
                    <li><Link to="/" onClick={() => setIsOpen(false)}>Scan</Link></li>
                    <li><Link to="/file" onClick={() => setIsOpen(false)}>File</Link></li>
                    <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
