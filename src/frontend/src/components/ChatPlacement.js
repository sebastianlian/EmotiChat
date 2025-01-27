import React from 'react';
// import './components_styles/DashboardLayout.css';
import ChatBubble from './ChatBubble'; // Import the ChatBubble component

const Layout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <div className="content-wrapper">
                {children} {/* Render the main content */}
            </div>
            {/* Add ChatBubble as a persistent feature */}
            <ChatBubble />
        </div>
    );
};

export default Layout;
