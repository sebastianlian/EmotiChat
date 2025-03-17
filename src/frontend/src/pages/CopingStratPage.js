import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import Sidebar from '../components/SideBar';
import './pages_styles/CopingStratPage.css';
import ChatPlacement from "../components/ChatPlacement";

const CopingStratPage = () => {
    const { user } = useAuth();
    const [copingStrategies, setCopingStrategies] = useState([]);

    // Fetch Coping Strategies from Backend
    useEffect(() => {
        const savedStrategies = localStorage.getItem(`copingStrategies-${user?.username}`);
        if (savedStrategies) {
            try {
                const parsedStrategies = JSON.parse(savedStrategies);
                setCopingStrategies(parsedStrategies);
            } catch (error) {
                console.error("Error parsing stored coping strategies:", error);
                setCopingStrategies([]); // Fallback to empty array if parsing fails
            }
        }
    }, [user?.username]);

    // Mark Strategy as Complete
    const markAsComplete = async (strategyId) => {
        try {
            await axios.patch(`http://localhost:5000/api/coping-strategies/${strategyId}/complete`);
            setCopingStrategies(prevStrategies =>
                prevStrategies.map(strategy =>
                    strategy._id === strategyId ? { ...strategy, completed: true } : strategy
                )
            );
        } catch (error) {
            console.error("Error marking strategy as complete:", error);
        }
    };

    // Extract Strategy Title & Content
    const extractTitleAndContent = (strategy) => {
        if (typeof strategy === "object" && strategy !== null) {
            return {
                title: strategy.title || "Coping Strategy",
                content: strategy.details || "",
            };
        }
        return { title: "Coping Strategy", content: "" };
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

                    <div className="progress-content">
                        {copingStrategies.length > 0 ? (
                            copingStrategies.map((strategy, index) => {
                                const { title, content } = extractTitleAndContent(strategy);
                                return (
                                    <div key={strategy._id} className={`card coping-strategy-card ${strategy.completed ? 'completed' : ''}`}>
                                        <h5 className="card-title">{title}</h5>
                                        <p>{content}</p>
                                        <button
                                            className="complete-btn"
                                            onClick={() => markAsComplete(strategy._id)}
                                            disabled={strategy.completed}
                                        >
                                            {strategy.completed ? "Completed" : "Mark as Complete"}
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