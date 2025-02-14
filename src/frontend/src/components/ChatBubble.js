import React, { useState } from 'react';
import './components_styles/ChatBubble.css';
import ChatMessengerInterface from './ChatMessengerInterface';
import { useDarkMode } from './DarkModeContext';

const ChatBubble = ({ username }) => {
    const [isOpen, setIsOpen] = useState(false); // Single state to control the chat
    const { darkMode } = useDarkMode();

    console.log("📌 ChatBubble received username:", username); // Debugging

    const toggleChat = () => {
        setIsOpen(!isOpen); // Toggle chat open/close state
    };

    return (
        <div className={`chat-bubble-container ${darkMode ? 'dark' : ''}`}>
            {/* Chat Bubble */}
            {!isOpen && (
                <button
                    className={`chat-bubble ${darkMode ? 'dark' : ''}`}
                    onClick={toggleChat}
                    aria-label="Open Chat"
                >
                    💬
                </button>
            )}

            {/* Chat Messenger */}
            {isOpen && (
                <ChatMessengerInterface
                    isOpen={isOpen}
                    toggleChat={toggleChat}
                    darkMode={darkMode}
                    username={username}/> // Get the username for the interface context
            )}
        </div>
    );
};

export default ChatBubble;
