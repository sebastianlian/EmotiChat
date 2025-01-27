import React, { useState } from 'react';
import './components_styles/ChatBubble.css';
import ChatMessengerInterface from './ChatMessengerInterface'; // Import ChatMessengerInterface
import { useDarkMode } from './DarkModeContext'; // Import dark mode context

const ChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false); // Single state to control the chat
    const { darkMode } = useDarkMode(); // Access dark mode state

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
                <ChatMessengerInterface isOpen={isOpen} toggleChat={toggleChat} darkMode={darkMode} />
            )}
        </div>
    );
};

export default ChatBubble;
