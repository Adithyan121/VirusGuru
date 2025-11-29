import React from 'react';

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
    </div>
</footer>

    );
};

export default Footer;
