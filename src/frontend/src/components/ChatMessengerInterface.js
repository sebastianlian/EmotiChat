import React, { useState } from 'react';
import './components_styles/ChatMessengerInterface.css';
import axios from 'axios';

const ChatMessengerInterface = ({ isOpen, toggleChat, darkMode, username }) => {
    const [messages, setMessages] = useState([]); // Stores all messages (user + bot)
    const [input, setInput] = useState(''); // User input

    const sendMessage = async () => {
        if (!input.trim()) {
            console.warn('Cannot send an empty message');
            return;
        }

        // Add the user's message to the messages array
        const userMessage = { sender: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        console.log('User message sent:', userMessage); // Debug user message
        console.log('Username being sent:', username); // Debug username

        try {
            // Send the user's message to the backend chatbot API
            const response = await axios.post('http://localhost:5000/api/chatbot/message', {
                message: input,
                username: username, // Ensure this is a valid string
            });

            console.log('Response from chatbot:', response.data);

            // Add the bot's response to the messages array
            const botMessage = { sender: 'bot', text: response.data.response };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error communicating with chatbot:', error);
            const botErrorMessage = { sender: 'bot', text: 'Sorry, I am unable to process your message at the moment.' };
            setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
        }

        // Clear the input field
        setInput('');
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : 'closed'} ${darkMode ? 'dark' : ''}`}>
            <div className="chatbot-header">
                <span>Chat with Us</span>
                <button onClick={toggleChat} aria-label="Close Chat">
                    ✖
                </button>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatMessengerInterface;
