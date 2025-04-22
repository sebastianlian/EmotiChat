import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';import './components_styles/ChatBubble.css';
import ChatMessengerInterface from './ChatMessengerInterface';
import { useDarkMode } from './DarkModeContext';

const ChatBubble = ({ username }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode } = useDarkMode();

    const [position, setPosition] = useState(() => {
        const bubbleSize = 60;
        const padding = 20;
        return {
            x: window.innerWidth - bubbleSize - padding,
            y: window.innerHeight - bubbleSize - padding
        };
    });

    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const wasDragging = useRef(false); // track if movement happened

    const handleMouseDown = (e) => {
        setDragging(true);
        wasDragging.current = false;
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;

        // Only consider as dragging if moved a little
        if (
            Math.abs(newX - position.x) > 5 ||
            Math.abs(newY - position.y) > 5
        ) {
            wasDragging.current = true;
        }

        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleClick = () => {
        if (!wasDragging.current) {
            setIsOpen(!isOpen);
        }
    };

    // Register global drag listeners
    useEffect(() => {
        const onMove = (e) => handleMouseMove(e);
        const onUp = () => handleMouseUp();

        if (dragging) {
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        }

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [dragging]);

    useEffect(() => {
        const handleResize = () => {
            const bubbleSize = 60;
            const padding = 20;
            const maxX = window.innerWidth - bubbleSize - padding;
            const maxY = window.innerHeight - bubbleSize - padding;

            setPosition(pos => ({
                x: Math.min(pos.x, maxX),
                y: Math.min(pos.y, maxY)
            }));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div
            className={`chat-bubble-container ${darkMode ? 'dark' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                position: 'fixed',
                cursor: dragging ? 'grabbing' : 'grab',
                zIndex: 1000
            }}
            onMouseDown={handleMouseDown}
        >
            {!isOpen && (
                <button
                    className={`chat-bubble ${darkMode ? 'dark' : ''}`}
                    onClick={handleClick}
                    aria-label="Open Chat"
                >
                    💬
                </button>
            )}

            {isOpen && (
                <ChatMessengerInterface
                    isOpen={isOpen}
                    toggleChat={() => setIsOpen(false)}
                    darkMode={darkMode}
                    username={username}
                />
            )}
        </div>
    );
};

export default ChatBubble;
