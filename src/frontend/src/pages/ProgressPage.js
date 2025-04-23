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
    const [weeklySentiments, setWeeklySentiments] = useState([]);

    // GRABS THE SENTIMENT DATA AND CONVERSATION DATA FOR THIS CLASS
    useEffect(() => {
        const fetchUserSentiments = async () => {
            if (!user?.username) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/progress/${user.username}`);
                const { sentiments, avgSentiment, emotionalState, detectedAnomalies, conversationMessages } = response.data;

                const enriched = sentiments.map(sentiment => {
                    let closestMatch = null;
                    let minDiff = Infinity;

                    conversationMessages.forEach(msg => {
                        if (msg.sender === 'user' && msg.emotionalState) {
                            const diff = Math.abs(new Date(msg.timestamp) - new Date(sentiment.timestamps));
                            if (diff < minDiff && diff <= 5 * 60 * 1000) { // within 5 min
                                minDiff = diff;
                                closestMatch = msg;
                            }
                        }
                    });

                    return {
                        ...sentiment,
                        emotionalState: closestMatch?.emotionalState || 'Unknown'
                    };
                });


                setSentimentData(enriched);
                setAverageSentiment(avgSentiment);
                // setMentalHealthStatus(mentalStatus);
                setEmotionalState(emotionalState);
                // setAnomalies(detectedAnomalies || []);
                console.log("Progress Data Response:", response.data);

            } catch (error) {
                console.error("Error fetching user progress:", error);
            }
        };

        fetchUserSentiments();
    }, [user?.username]);

    // GRABS DATA FOR LAST 7 DAYS
    useEffect(() => {
        const fetchWeeklySentiments = async () => {
            if (!user?.username) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/progress/weekly/${user.username}`);
                setWeeklySentiments(response.data.sentiments || []);
            } catch (error) {
                console.error("Error fetching weekly sentiment data:", error);
            }
        };

        fetchWeeklySentiments();
    }, [user?.username]);

    // Ensures I always show logged anomalies from the database
    useEffect(() => {
        const fetchAnomalies = async () => {
            if (!user?.username) return;

            try {
                const res = await axios.get(`http://localhost:5000/api/progress/anomalies/${user.username}`);
                setAnomalies(res.data.anomalies || []);
            } catch (error) {
                console.error("Error fetching anomalies:", error);
            }
        };

        fetchAnomalies();
    }, [user?.username]);


    // Chart Data for last 8 hours
    const chartData = {
        labels: sentimentData.map(entry => {
            const ts = new Date(entry.timestamps);
            return ts.toLocaleDateString(); // or .toLocaleTimeString()
        }),
        datasets: [
            {
                label: 'Sentiment Score',
                data: sentimentData.map(entry => entry.sentimentScore),
                borderColor: 'blue',
                fill: false,
            },
        ],
    };

    // Chart Options for last 8 hours
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

    // Chart data for last 7 days
    const weeklyChartData = {
        labels: weeklySentiments.map(entry => new Date(entry.timestamps).toLocaleDateString()),
        datasets: [
            {
                label: 'Sentiment Score',
                data: weeklySentiments.map(entry => entry.sentimentScore),
                borderColor: 'teal',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    // Chart options for last 7 days
    const weeklyChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.parsed.y;
                        const emotion = weeklySentiments[context.dataIndex]?.emotionalState || 'Unknown';
                        return [`Sentiment: ${value.toFixed(2)}`, `Emotion: ${emotion}`];
                    }
                }
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
                            <h5 className="card-title">Current Emotional Analysis</h5>
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

                        {/* LAST 8 HR ANALYSIS FEATURE */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card">
                                    <h5 className="card-title">Last 8 Hour Summary</h5>
                                    <div className="mb-3">
                                        <small>Analyze your mood progression over the last 8 hours.</small>
                                    </div>
                                    {sentimentData.length > 0 ? (
                                        <Line data={chartData} options={chartOptions}/>
                                    ) : (
                                        <p>No mood data available yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* 7 DAY ANALYSIS FEATURE */}
                            <div className="col-md-6">
                                <div className="card">
                                    <h5 className="card-title">Weekly Summary</h5>
                                    <div className="mb-3">
                                        <small>Analyze your mood progression over the last 7 days.</small>
                                    </div>

                                    {weeklySentiments.length > 0 ? (
                                        <Line data={weeklyChartData} options={weeklyChartOptions} />
                                    ) : (
                                        <p className="text-muted">No data from the past 7 days.</p>
                                    )}
                                </div>
                        </div>
                        </div>


                        <div className="card anomaly-card shadow-sm">
                            <h5 className="card-title">Anomaly Detection</h5>
                            <div className="mb-2">
                                <small className="card-subtitle text-muted">Detected mood patterns that may require attention.</small>
                            </div>

                            {anomalies.length > 0 ? (
                                <ul className="list-group anomaly-list-group" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                    {anomalies.map((anomaly, index) => (
                                        <li key={index} className="list-group-item d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-danger fw-bold">
                                                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                                                    {anomaly.description || "Anomaly detected"}
                                                    {/*{(anomaly.description?.split(" on ")[0].trim()) || "Anomaly detected"}*/}

                                                </span>

                                                <div className="d-flex align-items-center gap-2">
                                                    {/* Emotion Badge */}
                                                    {anomaly.emotionalState && (
                                                        <span
                                                            className="badge bg-secondary">{anomaly.emotionalState}
                                                        </span>
                                                    )}

                                                    {/* Timestamp Badge */}
                                                    <span className="badge bg-danger text-white">
                                                        {new Date(anomaly.timestamp).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            ) : (
                                <div className="text-muted">No anomalies detected during this period.</div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </ChatPlacement>
    );
};

export default ProgressPage;
