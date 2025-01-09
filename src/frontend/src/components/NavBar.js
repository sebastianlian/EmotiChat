import React from 'react';
import './components_styles/NavBar.css';

function MindfulChatLogo() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="logo-icon"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="#" className="navbar-logo">
                    <MindfulChatLogo />
                </a>
                <div className="navbar-links">
                    <a href="#features" className="navbar-link">Features</a>
                    <a href="#about" className="navbar-link">About</a>
                    <a href="#contact" className="navbar-link">Contact</a>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
