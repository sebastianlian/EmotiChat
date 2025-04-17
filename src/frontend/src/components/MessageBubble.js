import React, {useState} from 'react';
import './components_styles/MessageBubble.css';

const MessageBubble = ({ sender, text, timestamp }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => setExpanded(!expanded);

    const displayText = expanded ? text : text.slice(0, 150) + (text.length > 150 ? '...' : '');
    const formattedTime = new Date(timestamp).toLocaleString();

    return (
        <div className="message-group">
            <div className={`message-bubble ${sender === 'user' ? 'user' : 'bot'}`}>
                <p className="bubble-text">{displayText}</p>
                {text.length > 150 && (
                    <button className="read-more-btn" onClick={toggleExpand}>
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}
                <p className="timestamp">{formattedTime}</p>
            </div>
        </div>
    );
};


export default MessageBubble;