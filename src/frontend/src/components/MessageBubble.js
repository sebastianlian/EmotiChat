import React, {useState} from 'react';
import './components_styles/MessageBubble.css';

const MessageBubble = ({ sender, text, timestamp }) => {
    {/* DECLARES THE VARIABLES FOR TOGGLING, AND HANDLES THE STATE OF
    TOGGLING OF THE READ MORE LINK FOR EACH MESSAGE THAT IS OVER 150 CHARACTERS LONG */}
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => setExpanded(!expanded);

    {/* VARIABLES FOR DISPLAYING THE 150 CHARACTERS OF EACH MESSAGE */}
    const displayText = expanded ? text : text.slice(0, 150) + (text.length > 150 ? '...' : '');
    const formattedTime = new Date(timestamp).toLocaleString();

    return (
        <div className="message-group m-auto">
            {/* DISPLAYS EITHER USER OR BOT MESSAGE WITHIN A BUBBLE */}
            <div className="mobile-nav">
                <div className={`message-bubble ${sender === 'user' ? 'user' : 'bot'}`}>
                    {/* RENDERS THE CONVERSATION */}
                    <p className="bubble-text">{displayText}</p>
                    {/* IF THE TEXT IS OVER 150 CHARS A READ MORE LIKE APPEARS TO EXPAND THE MSG */}
                    {text.length > 150 && (
                            // IF TOGGLED -> SHOW LESS IS SHOWN
                            // IF NOT EXPANDED -> SHOWS READ MORE
                        <button className="read-more-btn" onClick={toggleExpand}>
                            {expanded ? 'Show less' : 'Read more'}
                        </button>
                    )}
                    {/* FORMATTED TIMESTAMP IS SHOWN */}
                    <p className="timestamp">{formattedTime}</p>
                </div>
        </div>
        </div>
    );
};


export default MessageBubble;