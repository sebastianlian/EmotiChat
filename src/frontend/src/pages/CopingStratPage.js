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

                console.log("Coping Strategies API Response:", response.data); // Debugging

                // Ensure data is structured correctly
                if (response.data && Array.isArray(response.data)) {
                    setCopingStrategies(response.data);
                    localStorage.setItem(`copingStrategies-${user.username}`, JSON.stringify(response.data));
                } else {
                    throw new Error("Invalid coping strategies format received from API.");
                }

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
    const toggleCompletion = async (strategyId) => {
        if (!strategyId) {
            console.error("Strategy ID is missing!");
            return;
        }

        console.log("🛠Toggling completion for strategy ID:", strategyId); // Debugging

        try {
            const response = await axios.patch(`http://localhost:5000/api/coping-strategies/${strategyId}`);
            const { strategy, motivationalMessage } = response.data;

            setCopingStrategies(prevStrategies =>
                prevStrategies.map(strategySet => ({
                    ...strategySet,
                    strategies: strategySet.strategies.map(s =>
                        s._id === strategyId ? { ...s, completed: strategy.completed } : s
                    )
                }))
            );

            // Store updated strategies in localStorage
            localStorage.setItem(`copingStrategies-${user.username}`, JSON.stringify(copingStrategies));

            if (strategy.completed) {
                setMotivationMessage(motivationalMessage);
                setTimeout(() => setMotivationMessage(""), 5000);
            } else {
                setMotivationMessage("");
            }

            console.log(`Strategy ${strategyId} completion updated to: ${strategy.completed}`);
        } catch (error) {
            console.error("Error updating strategy completion:", error);
        }
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

                    {/* Motivation Message */}
                    {motivationMessage && (
                        <div className="motivational-message">
                            {motivationMessage}
                        </div>
                    )}

                    <div className="progress-content">
                        {loading ? (
                            <p>Loading coping strategies...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : copingStrategies.length > 0 ? (
                            copingStrategies.map((strategySet, index) => (
                                <div key={index} className="coping-strategy-section">
                                    {/* Overview (First paragraph of the response) */}
                                    {strategySet?.overview && (
                                        <div className="overview-card">
                                            <h5 className="card-title">Overview</h5>
                                            <p>{strategySet.overview}</p>
                                        </div>
                                    )}

                                    {/* Coping Strategies (Only numbered lists) */}
                                    {Array.isArray(strategySet.strategies) && strategySet.strategies.length > 0 ? (
                                        strategySet.strategies.map((strategy, stratIndex) => (
                                            <div key={stratIndex} className={`card coping-strategy-card ${strategy.completed ? 'completed' : ''}`}>
                                                <h5 className="card-title">{strategy?.title || "Coping Strategy"}</h5>
                                                <ul>
                                                    {Array.isArray(strategy.steps) && strategy.steps.length > 0 ? (
                                                        strategy.steps.map((step, stepIndex) => (
                                                            <li key={stepIndex}>{step}</li>
                                                        ))
                                                    ) : (
                                                        <p>No steps provided.</p>
                                                    )}
                                                </ul>
                                                <button
                                                    className="complete-btn"
                                                    onClick={() => toggleCompletion(strategy._id, strategy.completed)}
                                                >
                                                    {strategy.completed ? "Undo Completion" : "Mark as Complete"}
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No strategies found.</p>
                                    )}

                                    {/* Conclusion (Last paragraph of the response) */}
                                    {strategySet?.conclusion && (
                                        <div className="conclusion-card">
                                            <h5 className="card-title">Final Thought</h5>
                                            <p>{strategySet.conclusion}</p>
                                        </div>
                                    )}
                                </div>
                            ))
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