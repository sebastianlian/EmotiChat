// This handles the chat messenger
import React, { useState } from 'react';
import './components_styles/ChatMessengerInterface.css';

const ChatMessengerInterface = () => {
    const [isOpen, setIsOpen] = useState(false); // State to toggle chat window

    const toggleChat = () => {
        setIsOpen(!isOpen); // Toggle between open and closed states
    };

    return (
        <div className={`chatbot ${isOpen ? 'open' : 'closed'}`}>
            <div className="chatbot-bubble" onClick={toggleChat}>
                {!isOpen && <span>💬</span>} {/* Show bubble icon only when closed */}
            </div>
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <span>Chat with Us</span>
                        <button onClick={toggleChat}>✖</button>
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
            )}
        </div>
    );
};

export default ChatMessengerInterface;
