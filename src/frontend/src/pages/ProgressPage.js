import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import Sidebar from '../components/SideBar';
import ChatPlacement from "../components/ChatPlacement";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Ensure Chart.js works

import './pages_styles/ProgressPage.css';

const ProgressPage = () => {
    const { user } = useAuth();
    const [sentimentData, setSentimentData] = useState([]);
    const [averageSentiment, setAverageSentiment] = useState(null);
    const [mentalHealthStatus, setMentalHealthStatus] = useState("Loading...");
    const [anomalies, setAnomalies] = useState([]);

    useEffect(() => {
        const fetchUserSentiments = async () => {
            if (!user?.username) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/progress/${user.username}`);
                const { sentiments, avgSentiment, mentalStatus, detectedAnomalies } = response.data;

                setSentimentData(sentiments);
                setAverageSentiment(avgSentiment);
                setMentalHealthStatus(mentalStatus);
                setAnomalies(detectedAnomalies || []);
            } catch (error) {
                console.error("Error fetching user progress:", error);
            }
        };

        fetchUserSentiments();
    }, [user?.username]);

    // Chart Data for Mood Trends
    const chartData = {
        labels: sentimentData.map(entry => entry.date), // Convert timestamps to readable dates
        datasets: [
            {
                label: 'Mood Score',
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
                            <h5 className="card-title">Mental State Analysis</h5>
                            <p><strong>Current Mental Health Status:</strong> {mentalHealthStatus}</p>
                            <p><strong>Average Sentiment Score:</strong> {averageSentiment !== null ? averageSentiment.toFixed(2) : "Loading..."}</p>
                        </div>

                        <div className="card">
                            <h5 className="card-title">Mood Trends</h5>
                            {sentimentData.length > 0 ? (
                                <Line data={chartData} />
                            ) : (
                                <p>No mood data available yet.</p>
                            )}
                        </div>

                        <div className="card">
                            <h5 className="card-title">Weekly Summary</h5>
                            <p>Analyze your mood progression over the last 7 days.</p>
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
