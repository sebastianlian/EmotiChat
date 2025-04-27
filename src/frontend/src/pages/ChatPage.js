import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import Sidebar from '../components/SideBar';
import ChatPlacement from '../components/ChatPlacement';
import './pages_styles/ChatPage.css';

const ChatPage = () => {
    const { user, darkMode } = useAuth();
    const [messages, setMessages] = useState(() => {
        if (typeof window !== "undefined" && user?.username) {
            const saved = localStorage.getItem(`chatHistory-${user.username}`);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user?.username) return;
        if (messages.length === 0) fetchFirstMessage();
    }, [user?.username]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (user?.username) {
            localStorage.setItem(`chatHistory-${user.username}`, JSON.stringify(messages));
        }
    }, [messages, user?.username]);

    const fetchFirstMessage = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/chatbot/first-message/${user.username}`);
            if (res.data.botResponse) {
                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setMessages([{ sender: 'bot', text: res.data.botResponse, time: timestamp }]);
            }
        } catch (error) {
            console.error("Error fetching first message:", error);
        }
    };

    const formatBotMessage = (text) => {
        const lines = text.split('\n').map(line => line.trim());
        let isNumberedList = lines.some(line => /^\d+\./.test(line));
        let isBulletList = lines.some(line => /^[-•]/.test(line));

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

        return <p>{text}</p>;
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage = { sender: 'user', text: input, time: timestamp };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const res = await axios.post('http://localhost:5000/api/chatbot/message', {
                message: input,
                username: user.username
            });

            if (res.data?.botResponse) {
                const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const botMessage = { sender: 'bot', text: res.data.botResponse, time: botTimestamp };
                setMessages(prev => [...prev, botMessage]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const autoResizeTextarea = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto'; // Reset height first
        textarea.style.height = `${textarea.scrollHeight}px`; // Then set it based on content
    };


    return (
        <ChatPlacement>
            <div className={`chatpage-wrapper ${darkMode ? 'dark-mode' : ''}`}>
                <Sidebar handleLogout={() => { window.location.href = '/login'; }} />

                <div className="chatpage-main">
                    <div className="chat-header">
                        <h1 className="main-title">Let's Chat</h1>
                        <p>Welcome, {user?.firstname || 'User'}! Feel free to share your thoughts below.</p>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message ${msg.sender}`}>
                                <div className="message-bubble">
                                    {msg.sender === 'bot' ? formatBotMessage(msg.text) : <p>{msg.text}</p>}
                                    <div className="timestamp">{msg.time}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        {/*<textarea*/}
                        {/*    placeholder="Type your message..."*/}
                        {/*    value={input}*/}
                        {/*    rows="1"*/}
                        {/*    onChange={(e) => setInput(e.target.value)}*/}
                        {/*    onKeyDown={handleKeyDown}*/}
                        {/*    className="chat-input"*/}
                        {/*/>*/}
                        <textarea
                            placeholder="Type your message..."
                            value={input}
                            className="chat-input"
                            onChange={(e) => {
                                setInput(e.target.value);
                                autoResizeTextarea(e); // 👈 call a helper to resize it!
                            }}
                            onKeyDown={handleKeyDown}
                        />

                        <button className="send-button" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </ChatPlacement>
    );
};

export default ChatPage;