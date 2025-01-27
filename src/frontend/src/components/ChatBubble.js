// This handles the chat bubble on the corner of the pages of the dashboard
import React, { useState } from 'react';
import './components_styles/ChatBubble.css';
import ChatMessengerInterface from './ChatMessengerInterface'; // Import your ChatMessengerInterface

const ChatBubble = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chat-bubble-container">
            {/* Chat Bubble */}
            {!isOpen && (
                <button className="chat-bubble" onClick={toggleChat} aria-label="Open Chat">
                    💬
                </button>
            )}

            {/* Chat Messenger with ChatMessengerInterface */}
            {isOpen && (
                <ChatMessengerInterface />
            )}
        </div>
    );
};

export default ChatBubble;
