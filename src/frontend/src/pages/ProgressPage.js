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
    // const [mentalHealthStatus, setMentalHealthStatus] = useState("Loading...");
    const [emotionalState, setEmotionalState] = useState("Loading...");
    const [anomalies, setAnomalies] = useState([]);

    // GRABS THE SENTIMENT DATA AND CONVERSATION DATA FOR THIS CLASS
    useEffect(() => {
        const fetchUserSentiments = async () => {
            if (!user?.username) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/progress/${user.username}`);
                const { sentiments, avgSentiment, emotionalState, detectedAnomalies, conversationMessages } = response.data;

                const enriched = sentiments.map(sentiment => {
                    const matchedMsg = conversationMessages.find(msg =>
                        msg.sender === 'user' &&
                        msg.emotionalState &&
                        Math.abs(new Date(msg.timestamp) - new Date(sentiment.timestamps)) < 5 * 60 * 1000
                    );
                    return {
                        ...sentiment,
                        emotionalState: matchedMsg?.emotionalState || 'Unknown'
                    };
                });

                setSentimentData(enriched);
                setAverageSentiment(avgSentiment);
                setEmotionalState(emotionalState);
                setAnomalies(detectedAnomalies || []);
                console.log("Progress Data Response:", response.data);

            } catch (error) {
                console.error("Error fetching user progress:", error);
            }
        };

        fetchUserSentiments();
    }, [user?.username]);


    // Chart Data for Emotional Trends
    const chartData = {
        // labels: sentimentData.map(entry => entry.date), // Convert timestamps to readable dates
        labels: sentimentData.map(entry => {
            const ts = new Date(entry.timestamps);
            return ts.toLocaleDateString(); // or .toLocaleTimeString()
        }),
        datasets: [
            {
                label: 'Mood Score',
                data: sentimentData.map(entry => entry.sentimentScore),
                borderColor: 'blue',
                fill: false,
            },
        ],
    };

    // Chart Options for Emotional Trends
    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.parsed.y;
                        const index = context.dataIndex;
                        const emotion = sentimentData[index]?.emotionalState || "Unknown";
                        return [
                            `Sentiment Score: ${value.toFixed(2)}`,
                            `Emotion: ${emotion}`
                        ];
                    },
                    title: function (context) {
                        // Pull full date from the original data
                        const originalTimestamp = sentimentData[context[0].dataIndex].timestamps;
                        const fullDate = new Date(originalTimestamp).toLocaleString();
                        return `Date: ${fullDate}`;
                    }

                }
            },
            legend: {
                display: true
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMin: -1,
                suggestedMax: 1
            }
        }
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
                        {/* CARD DISPLAYING EMOTIONAL ANALYSIS OF USER: CURRENT EMOTION AND ROLLING AVG SENTIMENT SCORE */}
                        <div className="card">
                            <h5 className="card-title">Emotional Analysis</h5>
                            <p><strong>Current Emotional Status:</strong> {emotionalState}</p>
                            <p>
                                <strong>Average Sentiment Score:</strong>
                                {averageSentiment !== null ? averageSentiment.toFixed(2) : "Loading..."}
                                <i
                                    className="bi bi-info-circle-fill ms-2"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="This is your average sentiment over the past 8 hours. Higher is more positive, lower is more negative."
                                    style={{cursor: 'pointer'}}
                                ></i>
                            </p>
                        </div>

                        {/* CHART OF EMOTIONAL TRENDS */}
                        <div className="card">
                            <h5 className="card-title">Emotional Trends</h5>
                            {sentimentData.length > 0 ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <p>No mood data available yet.</p>
                            )}
                        </div>

                        {/* TODO: IMPLEMENT THE 7 DAY ANALYSIS FEATURE */}
                        <div className="card">
                            <h5 className="card-title">Weekly Summary</h5>
                            <p>Analyze your mood progression over the last 7 days.</p>
                        </div>

                        {/* TODO: IMPLEMENT THE ANOMALY DETECTION FEATURE */}
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
