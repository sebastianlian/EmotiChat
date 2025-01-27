import React from 'react';
import ChatBubble from './ChatBubble';
import { useAuth } from './AuthContext'; // Import AuthContext to get the user

const ChatPlacement = ({ children }) => {
    const { user } = useAuth(); // Access user from AuthContext

    return (
        <div className="dashboard-layout">
            <div className="content-wrapper">
                {children} {/* Render the main content */}
            </div>
            {/* Add ChatBubble as a persistent feature */}
            <ChatBubble username={user?.username} /> {/* Pass username to ChatBubble */}
        </div>
    );
};

export default ChatPlacement;
