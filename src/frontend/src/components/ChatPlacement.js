import React from 'react';
// import ChatBubble from './ChatBubble';
import { useAuth } from './AuthContext'; // Import AuthContext to get the user

const ChatPlacement = ({ children }) => {
    const { user } = useAuth(); // Access user from AuthContext
    const username = user?.username || "Guest";

    console.log("ChatPlacement received username:", username); // Debugging

    return (
        <div className="dashboard-layout">
            <div className="content-wrapper">
                {children} {/* Render the main content */}
            </div>
            {/*/!* Add ChatBubble as a persistent feature *!/*/}
            {/*<ChatBubble username={username} /> /!* Pass username to ChatBubble *!/*/}
        </div>
    );
};

export default ChatPlacement;
