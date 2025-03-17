import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import Sidebar from '../components/SideBar';
import './pages_styles/CopingStratPage.css';
import ChatPlacement from "../components/ChatPlacement";

const CopingStratPage = () => {
    const { user } = useAuth();
    const [copingStrategies, setCopingStrategies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [motivationMessage, setMotivationMessage] = useState("");

    // Fetch Coping Strategies from Backend
    useEffect(() => {
        const fetchCopingStrategies = async () => {
            if (!user?.username) return;
            setLoading(true);

            try {
                const response = await axios.get(`http://localhost:5000/api/coping-strategies/${user.username}`);
                setCopingStrategies(response.data); // Store in state
                localStorage.setItem(`copingStrategies-${user.username}`, JSON.stringify(response.data)); // Also cache in localStorage
            } catch (err) {
                console.error("Error fetching coping strategies:", err);
                setError("Failed to fetch coping strategies.");
            } finally {
                setLoading(false);
            }
        };

        fetchCopingStrategies();
    }, [user?.username]);

    // Toggle Completion (Mark as Complete OR Undo AND Display Motivation Message)
    const toggleCompletion = async (strategyId, currentStatus) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/coping-strategies/${strategyId}`);
            const { strategy, motivationalMessage } = response.data;

            setCopingStrategies(prevStrategies => {
                const updatedStrategies = prevStrategies.map(s =>
                    s._id === strategyId ? { ...s, completed: strategy.completed } : s
                );

                // Save updated strategies to localStorage
                localStorage.setItem(`copingStrategies-${user.username}`, JSON.stringify(updatedStrategies));
                return updatedStrategies;
            });

            // Set Motivation Message (only when marking as complete)
            if (strategy.completed) {
                setMotivationMessage(motivationalMessage);

                // Hide the message after 5 seconds
                setTimeout(() => {
                    setMotivationMessage("");
                }, 5000);
            } else {
                setMotivationMessage(""); // Clear if undoing completion
            }
        } catch (error) {
            console.error("Error updating strategy completion:", error);
        }
    };

    // Extract Strategy Title & Content
    const extractTitleAndContent = (strategy) => {
        return {
            title: strategy.title || "Coping Strategy",
            content: strategy.details || "",
        };
    };

    return (
        <ChatPlacement>
            <div className="progress-page-wrapper">
                <Sidebar handleLogout={() => { window.location.href = '/login'; }} />

                <div className="main-content">
                    <div className="progress-header">
                        <h1 className="main-title">Daily Coping Guide</h1>
                        <p>Welcome, {user?.firstname || 'User'}! Here are some strategies to help you navigate your day.</p>
                    </div>

                    {motivationMessage && (
                        <div className={`motivational-message ${motivationMessage ? '' : 'hidden'}`}>
                            {motivationMessage}
                        </div>
                    )}

                    <div className="progress-content">
                        {loading ? (
                            <p>Loading coping strategies...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : copingStrategies.length > 0 ? (
                            copingStrategies.map((strategy, index) => {
                                const { title, content } = extractTitleAndContent(strategy);
                                return (
                                    <div key={strategy._id} className={`card coping-strategy-card ${strategy.completed ? 'completed' : ''}`}>
                                        <h5 className="card-title">{title}</h5>
                                        <p>{content}</p>
                                        <button
                                            className="complete-btn"
                                            onClick={() => toggleCompletion(strategy._id, strategy.completed)}
                                            // disabled={strategy.completed}
                                        >
                                            {strategy.completed ? "Undo Completion" : "Mark as Complete"}
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="card">
                                <h5 className="card-title">Coping Strategies</h5>
                                <p>No coping strategies yet. Try chatting with the bot to receive some.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ChatPlacement>
    );
};

export default CopingStratPage;
