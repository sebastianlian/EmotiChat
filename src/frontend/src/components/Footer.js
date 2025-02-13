import React from 'react';
import './components_styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <span>© 2025 EmotiChat. All rights reserved.</span>
                <div className="footer-links">
                    <a href="/eula" className="footer-link">Terms of Service</a>
                    <a href="/privacy" className="footer-link">Privacy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
