import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext'; // Import the AuthContext
import Sidebar from '../components/SideBar'; // Import the Sidebar component
import './pages_styles/Dashboard.css';
import { BsMoon, BsSun, BsCloudSun } from 'react-icons/bs';
import ChatPlacement from "../components/ChatPlacement";
import MessageBubble from '../components/MessageBubble';
import {useDarkMode} from "../components/DarkModeContext";

const Dashboard = () => {
    const { user, logout } = useAuth(); // Access user information from AuthContext
    const username = user?.username || "Guest"; // Ensure username always has a value
    const currentHour = new Date().getHours(); // Get the current hour

    console.log("Dashboard received username:", username, user); // Debugging

    const handleLogout = () => {
        logout();
        window.location.href = '/login'; // Redirect to login
    };

    const getGreeting = () => {
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getGreetingIcon = () => {
        if (currentHour < 12) return <BsSun className="time-icon" />;
        if (currentHour < 18) return <BsCloudSun className="time-icon" />;
        return <BsMoon className="time-icon" />;
    };

    const [recentMessages, setRecentMessages] = useState([]);

    useEffect(() => {
        const fetchRecentMessages = async () => {
            if (!username || username === "Guest") return;

            try {
                const response = await axios.get(`http://localhost:5000/api/chatbot/recent-messages/${username}`);
                setRecentMessages(response.data.messages || []);
            } catch (error) {
                console.error("Error fetching recent messages:", error);
            }
        };

        fetchRecentMessages();
    }, [username]);

    const [journalEntry, setJournalEntry] = useState("");
    const { isDarkMode } = useDarkMode();
    const [selectedEmotion, setSelectedEmotion] = useState('');

    const emotionOptions = [
        "Joy", "Excitement", "Calm", "Anxiety", "Sadness",
        "Frustration", "Overwhelm", "Hopeful", "Tired", "Motivated"
    ];

    const handleSaveEntry = async () => {
        if (!journalEntry || !selectedEmotion) {
            alert("Please enter text and select an emotion.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/journal/entry", {
                username,
                entry: journalEntry,
                emotion: selectedEmotion
            });

            console.log("Entry saved:", res.data);
            setJournalEntry("");
            setSelectedEmotion("");
            alert("Journal entry saved!");
        } catch (error) {
            console.error("Error saving journal entry:", error);
            alert("Something went wrong while saving.");
        }
    };

    const [emotionalTrends, setEmotionalTrends] = useState([]);

    useEffect(() => {
        const fetchEmotionalTrends = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/chatbot/emotional-states/${username}`);
                setEmotionalTrends(response.data.emotionalStates || []);
            } catch (err) {
                console.error("Error fetching emotional trends:", err);
            }
        };

        if (username && username !== "Guest") {
            fetchEmotionalTrends();
        }
    }, [username]);


    return (
        <ChatPlacement username={username}>
            <div className="dashboard-wrapper">
                <div className="dashboard-container">
                    {/* Sidebar */}
                    <Sidebar handleLogout={handleLogout} />

                    {/* Main Content */}
                    <div className="main-content">
                        <div className="welcome-banner fade-in">
                            <h1 className="welcome-message">
                                {getGreeting()} {getGreetingIcon()}, {user?.firstname || 'User'}!
                            </h1>
                        </div>
                        {/*<h1 className="main-title">Dashboard</h1>*/}
                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                            <h5 className="card-title d-flex align-items-center pb-2">
                                <div className="icon-container">
                                    <i className="bi bi-bell"></i>
                                </div>
                                Reminder
                            </h5>
                            <p>Don't forget to log your mood today. It helps us provide better support!</p>
                            <button type="button" className="btn-close" data-bs-dismiss="alert"
                                    aria-label="Close">
                            </button>
                        </div>

                        {/* RECENT CONVO CARD */}
                        <div className="card mb-4">
                            <h5 className="card-title">Recent Conversation</h5>
                            {recentMessages.slice(-4).map((msg, index) => (
                                <div key={index} className={`chat-row ${msg.sender === 'user' ? 'right' : 'left'}`}>
                                    <MessageBubble sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
                                </div>
                            ))}
                        </div>


                        <div className="row">
                            <div className="col-md-6">
                                <div className="card mood-trend-card">
                                    <h5 className="card-title">Mood Trends</h5>
                                    <p className="card-subtitle">Your emotional state from recent
                                        conversations</p>
                                    <ul className="list-group list-group-flush">
                                        {emotionalTrends.length > 0 ? (
                                            emotionalTrends.map((entry, index) => (
                                                <li key={index}
                                                    className="list-group-item d-flex justify-content-between align-items-center mood-entry">
                                                    <span className="date-label">
                                                        {new Date(entry.timestamp).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                                    </span>
                                                    <span className={`badge emotion-badge`}>
                                                        {entry.emotionalState}
                                                    </span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item text-muted">No recent emotional states
                                                available.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>


                            {/*<div className="col-md-6">*/}
                            {/*    <div className="card">*/}
                            {/*        <h5 className="card-title">Recent Goals</h5>*/}
                            {/*        <p>Your latest objectives</p>*/}
                            {/*        <ul>*/}
                            {/*            <li>Text</li>*/}
                            {/*            <li>Text</li>*/}
                            {/*            <li>Text</li>*/}
                            {/*        </ul>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/* MOOD JOURNAL CARD */}
                            <div className="col-md-6">
                                <div className="card mb-4 mood-journal">
                                    <h5 className="card-title">Mood Journal</h5>
                                    <p>Write down how you're feeling right now. Journaling helps track mood patterns and
                                        emotional health over time.</p>

                                    <div className="form-container">
                                        <select
                                            className="form-select"
                                            value={selectedEmotion}
                                            onChange={(e) => setSelectedEmotion(e.target.value)}
                                        >
                                            <option value="">Select Emotion</option>
                                            {emotionOptions.map((emotion, index) => (
                                                <option key={index} value={emotion}>{emotion}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="text-area-container">
                                        <textarea
                                            className={`form-control ${isDarkMode ? 'dark-mode-textarea' : ''}`}
                                            rows="5"
                                            placeholder="Today I'm feeling..."
                                            value={journalEntry}
                                            onChange={(e) => setJournalEntry(e.target.value)}
                                        />

                                    </div>

                                    <button
                                        className={`btn mt-2 ${isDarkMode ? 'btn-outline-light' : 'btn-primary'}`}
                                        onClick={handleSaveEntry}
                                    >
                                        Save Entry
                                    </button>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </ChatPlacement>
    );
};

export default Dashboard;
