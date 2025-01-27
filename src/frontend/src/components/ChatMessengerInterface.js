import React from 'react';
import './components_styles/ChatMessengerInterface.css';

const ChatMessengerInterface = ({ isOpen, toggleChat, darkMode }) => {
    return (
        <div className={`chatbot-container ${isOpen ? 'open' : 'closed'} ${darkMode ? 'dark' : ''}`}>
            <div className="chatbot-header">
                <span>Chat with Us</span>
                <button onClick={toggleChat} aria-label="Close Chat">
                    ✖
                </button>
            </div>
            <div className="chatbot-messages">
                {/* Example messages */}
                <div className="chat-message bot">Hello! How can I assist you today?</div>
                <div className="chat-message user">I need help with...</div>
            </div>
            <div className="chatbot-input">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
            </div>
        </div>
    );
};

export default ChatMessengerInterface;
