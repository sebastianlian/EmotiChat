import React, {useEffect, useState, useRef} from 'react';
import './components_styles/ChatMessengerInterface.css';
import axios from 'axios';

const ChatMessengerInterface = ({ isOpen, toggleChat, darkMode, username }) => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem(`chatHistory-${username}`);
        return savedMessages ? JSON.parse(savedMessages) : [];
    });

    const [input, setInput] = useState(''); // User input
    const [isExpanded, setIsExpanded] = useState(false); // State for expanded mode
    const messagesEndRef = useRef(null); // Reference to the last message

    // **Scroll to latest message**
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        localStorage.setItem(`chatHistory-${username}`, JSON.stringify(messages));
        scrollToBottom(); // Scroll every time messages update
    }, [messages, username]); // Save chat history when messages update


    useEffect(() => {
        let hasFetched = false; // Prevent duplicate fetch calls

        const fetchFirstMessage = async () => {
            if (hasFetched) return; // Stop multiple calls
            hasFetched = true;

            try {
                const response = await axios.get(`http://localhost:5000/api/chatbot/first-message/${username}`);
                if (response.data.botResponse) {
                    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    setMessages((prevMessages) => {
                        // **🚀 Prevent duplicate bot messages from being added**
                        if (prevMessages.some(msg => msg.text === response.data.botResponse)) return prevMessages;
                        return [...prevMessages, { sender: 'bot', text: response.data.botResponse, time: timestamp }];
                    });
                }
            } catch (error) {
                console.error("Error fetching first message:", error);
            }
        };

        if (isOpen && messages.length === 0) {  // Ensures it only runs when the chat opens & messages are empty
            fetchFirstMessage();
        }
    }, [isOpen, username]); // Runs only when chat opens or username changes

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

    // const sendMessage = async () => {
    //     if (!input.trim()) {
    //         console.warn('Cannot send an empty message');
    //         return;
    //     }
    //
    //     if (!username) {
    //         console.error('ERROR: Username is missing before sending the request!');
    //     }
    //
    //     // Get current timestamp
    //     const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    //
    //     // Add the user's message to the messages array
    //     const userMessage = { sender: 'user', text: input, time: timestamp };
    //     setMessages((prevMessages) => [...prevMessages, userMessage]);
    //
    //     // console.log('User message sent:', userMessage); // Debug user message
    //     // console.log('Sender type being sent', userMessage.sender);
    //     // console.log('Username being sent:', username); // Debug username
    //
    //     try {
    //         const response = await axios.post('http://localhost:5000/api/chatbot/message', {
    //             message: input,
    //             username: username,
    //         });
    //
    //         console.log('Full response from chatbot:', response.data);
    //
    //         if (!response.data || !response.data.botResponse) {
    //             console.error('Invalid chatbot response:', response.data);
    //             return;
    //         }
    //
    //         // Ensure the response is added to state
    //         const botMessage = { sender: 'bot', text: response.data.botResponse, time: timestamp };
    //         console.log('Bot message to be added:', botMessage);
    //         setMessages((prevMessages) => [...prevMessages, botMessage]);
    //
    //     } catch (error) {
    //         if (error.response) {
    //             console.error('Axios Error:', error.response.data);
    //             console.error('Status Code:', error.response.status);
    //         } else if (error.request) {
    //             console.error('No Response Received:', error.request);
    //         } else {
    //             console.error('Request Setup Error:', error.message);
    //         }
    //     }
    //
    //     // Clear the input field
    //     setInput('');
    // };

    const [copingStrategies, setCopingStrategies] = useState([]); // New state to store strategies

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

            // Extract the bot response and coping strategies
            const botMessage = { sender: 'bot', text: response.data.botResponse, time: timestamp };
            const newStrategies = response.data.copingStrategies || [];

            setMessages((prevMessages) => [...prevMessages, botMessage]);

            if (newStrategies.length > 0) {
                setCopingStrategies((prevStrategies) => {
                    const updatedStrategies = [...prevStrategies, ...newStrategies];

                    // **Save to localStorage**
                    localStorage.setItem(`copingStrategies-${username}`, JSON.stringify(updatedStrategies));

                    return updatedStrategies;
                });
            }

        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }

        setInput(''); // Clear input field
    };

    const autoResizeTextarea = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Expand height
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
                {/* Invisible element at the bottom to scroll into view */}
                <div ref={messagesEndRef}/>
            </div>

            <div className="chatbot-input">
                <textarea
                    className="chatbot-textarea"
                    placeholder="Type a message..."
                    value={input}
                    rows={1}
                    onChange={(e) => {
                        setInput(e.target.value);
                        autoResizeTextarea(e);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // Prevent newline
                            sendMessage();
                        }
                    }}
                />
                <button onClick={sendMessage}>Send</button>
            </div>

        </div>
    );
};
export default ChatMessengerInterface;
