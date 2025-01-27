import React, { useState } from 'react';
import './components_styles/ChatMessengerInterface.css';
import axios from 'axios';

const ChatMessengerInterface = ({ isOpen, toggleChat, darkMode, username }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input.trim()) return;

        console.log('Sending message:', input); // Log the user's input
        console.log('Username being sent:', username); // Log the username

        try {
            const response = await axios.post('http://localhost:5000/api/chatbot/message', {
                message: input,
                username: username, // Ensure this is a valid string
            });

            console.log('Response from chatbot:', response.data);

            const botMessage = { sender: 'bot', text: response.data.response };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error communicating with chatbot:', error);
            const botErrorMessage = { sender: 'bot', text: 'Sorry, I am unable to process your message at the moment.' };
            setMessages((prevMessages) => [...prevMessages, botErrorMessage]);
        }

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
