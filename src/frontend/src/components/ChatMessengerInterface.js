import React, { useState } from 'react';
import './components_styles/ChatMessengerInterface.css';
import axios from 'axios';

const ChatMessengerInterface = ({ isOpen, toggleChat, darkMode, username }) => {
    const [messages, setMessages] = useState([]); // Stores all messages (user + bot)
    const [input, setInput] = useState(''); // User input
    const [isExpanded, setIsExpanded] = useState(false); // State for expanded mode

    // Function to detect and format bot messages into bullet points to simplify readiablity
    const formatBotMessage = (text) => {
        const lines = text.split('\n').map(line => line.trim()); // Split by new lines
        let isNumberedList = lines.some(line => /^\d+\./.test(line)); // Check if any line is a numbered list
        let isBulletList = lines.some(line => /^[-•]/.test(line)); // Check if any line is a bullet point list

        if (isNumberedList) {
            return (
                <ol className="bot-response-list">
                    {lines.map((line, idx) =>
                        /^\d+\./.test(line) ? <li key={idx}>{line.replace(/^\d+\.\s*/, '')}</li> : <p key={idx}>{line}</p>
                    )}
                </ol>
            );
        }

        if (isBulletList) {
            return (
                <ul className="bot-response-list">
                    {lines.map((line, idx) =>
                        /^[-•]/.test(line) ? <li key={idx}>{line.replace(/^[-•]\s*/, '')}</li> : <p key={idx}>{line}</p>
                    )}
                </ul>
            );
        }

        return <p>{text}</p>; // Default to normal text
    };

    const sendMessage = async () => {
        if (!input.trim()) {
            console.warn('Cannot send an empty message');
            return;
        }

        if (!username) {
            console.error('ERROR: Username is missing before sending the request!');
        }

        // Get current timestamp
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Add the user's message to the messages array
        const userMessage = { sender: 'user', text: input, time: timestamp };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // console.log('User message sent:', userMessage); // Debug user message
        // console.log('Sender type being sent', userMessage.sender);
        // console.log('Username being sent:', username); // Debug username

        try {
            const response = await axios.post('http://localhost:5000/api/chatbot/message', {
                message: input,
                username: username,
            });

            console.log('Full response from chatbot:', response.data);

            if (!response.data || !response.data.botResponse) {
                console.error('Invalid chatbot response:', response.data);
                return;
            }

            // Ensure the response is added to state
            const botMessage = { sender: 'bot', text: response.data.botResponse, time: timestamp };
            console.log('Bot message to be added:', botMessage);
            setMessages((prevMessages) => [...prevMessages, botMessage]);

        } catch (error) {
            if (error.response) {
                console.error('❌ Axios Error:', error.response.data);
                console.error('❌ Status Code:', error.response.status);
            } else if (error.request) {
                console.error('❌ No Response Received:', error.request);
            } else {
                console.error('❌ Request Setup Error:', error.message);
            }
        }

        // Clear the input field
        setInput('');
    };

    return (
        <div
            className={`chatbot-container ${isOpen ? 'open' : 'closed'} ${darkMode ? 'dark' : ''} ${isExpanded ? 'expanded' : 'compact'}`}>
            <div className="chatbot-header">
                <span>Chat with Us</span>
                <div className="chat-controls">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="expand-btn">
                        {isExpanded ? '➖' : '➕'}
                    </button>
                    <button onClick={toggleChat} aria-label="Close Chat" className="close-btn">
                        ✖
                    </button>
                </div>
            </div>
            {/*<div className="chatbot-messages">*/}
            {/*    {messages.length > 0 ? (*/}
            {/*        messages.map((msg, idx) => (*/}
            {/*            <div key={idx} className={`chat-message ${msg.sender}`}>*/}
            {/*                {msg.sender === 'bot' ? formatBotMessage(msg.text) : msg.text}*/}
            {/*            </div>*/}
            {/*        ))*/}
            {/*    ) : (*/}
            {/*        <p className="empty-chat">No messages yet</p>*/}
            {/*    )}*/}
            {/*</div>*/}
            <div className="chatbot-messages">
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.sender}`}>
                            <div className="message-content">
                                {msg.sender === 'bot' ? formatBotMessage(msg.text) : <p>{msg.text}</p>}
                            </div>
                            <span className="timestamp">{msg.time}</span>
                        </div>
                    ))
                ) : (
                    <p className="empty-chat">No messages yet</p>
                )}
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
