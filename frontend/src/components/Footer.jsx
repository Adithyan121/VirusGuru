import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>
                    &copy; {new Date().getFullYear()}{" "}
                    <a
                        href="https://adithyan-phi.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            fontWeight: "bold"
                        }}
                    >
                        Adithyan G
                    </a>.
                    All rights reserved.
                </p>
                <p>Powered by MERN Stack</p>
                <p style={{ marginTop: '10px' }}>
                    <Link to="/privacy" style={{ color: 'var(--secondary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link>
                </p>
            </div>
        </footer>

    );
};

export default Footer;
