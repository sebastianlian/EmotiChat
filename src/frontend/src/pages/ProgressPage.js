import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import Sidebar from '../components/SideBar';
import ChatPlacement from "../components/ChatPlacement";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

import './pages_styles/ProgressPage.css';

const ProgressPage = () => {
    const { user } = useAuth();
    const [sentimentData, setSentimentData] = useState([]);
    const [averageSentiment, setAverageSentiment] = useState(null);
    const [emotionalStatus, setEmotionalStatus] = useState("Loading...");
    const [anomalies, setAnomalies] = useState([]);

    useEffect(() => {
        const fetchUserProgress = async () => {
            if (!user?.username) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/chatbot/progress/${user.username}`);
                const { sentiments, avgSentiment, mentalStatus, detectedAnomalies } = response.data;

                console.log("Progress API Response:", response.data); // Debugging line

                setSentimentData(sentiments);
                setAverageSentiment(avgSentiment);
                setEmotionalStatus(mentalStatus);
                setAnomalies(detectedAnomalies || []);
            } catch (error) {
                console.error("Error fetching user progress:", error);
            }
        };

        fetchUserProgress();
    }, [user?.username]);


    // Chart Data for Mood Trends
    const chartData = {
        labels: sentimentData.map(entry => entry.date), // Convert timestamps to readable dates
        datasets: [
            {
                label: 'Emotion Score',
                data: sentimentData.map(entry => entry.sentimentScore),
                borderColor: 'blue',
                fill: false,
            },
        ],
    };

    return (
        <ChatPlacement>
            <div className="progress-page-wrapper">
                <Sidebar handleLogout={() => { window.location.href = '/login'; }} />

                <div className="main-content">
                    <div className="progress-header">
                        <h1 className="main-title">Progress Overview</h1>
                        <p>Welcome, {user?.firstname || 'User'}! Here’s how you've been feeling recently.</p>
                    </div>

                    <div className="progress-content">
                        <div className="card">
                            <h5 className="card-title">Current Status</h5>
                            <p><strong>Current Emotional Status:</strong> {emotionalStatus}</p>
                            <p><strong>Average Sentiment Score:</strong> {averageSentiment !== null ? averageSentiment.toFixed(2) : "Loading..."}</p>
                        </div>

                        <div className="card">
                            <h5 className="card-title">Emotional Trends</h5>
                            {sentimentData.length > 0 ? (
                                <Line data={chartData} />
                            ) : (
                                <p>No mood data available yet.</p>
                            )}
                        </div>

                        <div className="card">
                            <h5 className="card-title">Weekly Summary</h5>
                            <p>Analyze your progression over the last 7 days.</p>
                        </div>

                        <div className="card">
                            <h5 className="card-title">Anomaly Detection</h5>
                            {anomalies.length > 0 ? (
                                <ul>
                                    {anomalies.map((anomaly, index) => (
                                        <li key={index}>{anomaly.message}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No anomalies detected.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ChatPlacement>
    );
};

export default ProgressPage;
