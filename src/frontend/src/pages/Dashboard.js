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

    {/* HOOK FOR RECENT CONVO SNAPSHOT BEGINS HERE
    THIS RUNS WHEN THE PAGE LOADS AND GETS THE LAST
    4 MESSAGES FROM THE BACKEND CHATROUTES.JS */}
    const [recentMessages, setRecentMessages] = useState([]);

    useEffect(() => {
        const fetchRecentMessages = async () => {
            if (!username || username === "Guest") return;

            try {
                const response = await axios.get(
                    `http://localhost:5000/api/chatbot/recent-messages/${username}`);
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

    const [completedStrategies, setCompletedStrategies] = useState([]);

    useEffect(() => {
        const fetchCompletedStrategies = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/coping-strategies/${username}`);
                const allStrategies = res.data;

                console.log("All coping strategies response:", res.data);

                // Flatten and filter completed nested strategies
                const completed = allStrategies
                    .flatMap(cs => cs.strategies || []) // access nested .strategies
                    .filter(s => s.completed)
                    .slice(-5); // show latest 5

                setCompletedStrategies(completed);
            } catch (error) {
                console.error("Error fetching completed strategies:", error);
            }
        };

        if (username && username !== "Guest") {
            fetchCompletedStrategies();
        }
    }, [username]);

    const [motivationalQuote, setMotivationalQuote] = useState("");

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/motivation/${username}`);
                setMotivationalQuote(res.data.quote);
            } catch (err) {
                console.error("Error fetching quote:", err);
            }
        };

        if (username && username !== "Guest") {
            fetchQuote();
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
                            <p className="motivational-inline">{motivationalQuote}</p>
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
                        <div className="row">
                            {/* LEFT COLUMN: Conversation + Mood Journal */}
                            <div className="col-md-6 d-flex flex-column" style={{ height: '100%' }}>
                                {/* RECENT CONVO CARD */}
                                <div className="card mb-4 flex-fill">
                                    <h5 className="card-title">Recent Conversation Snapshot</h5>
                                    <div className="mb-3">
                                        <small className="card-subtitle">An overview of your last conversation.</small>
                                    </div>
                                    {recentMessages.length === 0 ? (
                                        <p className="no-convo-yet-text text-muted">
                                            You haven't started a chat yet. Say hi to your mental health assistant and start
                                            tracking how you feel 💬
                                        </p>
                                    ) : (
                                        recentMessages.slice(-2).map((msg, index) => (
                                            <div key={index} className={`chat-row ${msg.sender === 'user' ? 'right' : 'left'}`}>
                                                <MessageBubble sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* MOOD JOURNAL CARD */}
                                <div className="card mb-4 flex-fill">
                                    <h5 className="card-title">Mood Journal</h5>
                                    <div className="mb-3">
                                        <small className="card-subtitle">
                                            Write down how you're feeling right now. Journaling helps track mood patterns and
                                            emotional health over time.
                                        </small>
                                    </div>

                                    <div className="form-container">
                                        <select
                                            className="form-select w-50"
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
                                            className={`form-control handwriting-textarea ${isDarkMode ? 'dark-mode-textarea' : ''}`}
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

                            {/* RIGHT COLUMN: Mood Trends + Completed Strategy */}
                            <div className="col-md-6 d-flex flex-column" style={{ height: '100%' }}>
                                {/* MOOD TRENDS CARD */}
                                <div className="card mood-trend-card mb-4 flex-fill">
                                    <h5 className="card-title">Recent Emotions Snapshot</h5>
                                    <div className="mb-3">
                                        <small className="card-subtitle">Your emotional state from recent conversations.</small>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        {emotionalTrends.length > 0 ? (
                                            emotionalTrends.map((entry, index) => (
                                                <li key={index}
                                                    className="list-group-item d-flex justify-content-between align-items-center mood-entry">
                                                    <span className="date-label">
                                                        {new Date(entry.timestamp).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                                            <span className={`badge emotion-badge`}>
                                                        {entry.emotionalState}
                                                    </span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="list-group-item text-muted">No recent emotional states available.</li>
                                        )}
                                    </ul>
                                </div>

                                {/* COMPLETED STRATEGY CARD */}
                                <div className="card flex-fill">
                                    <h5 className="card-title">Recently Completed Strategy</h5>
                                    <div className="mb-3">
                                        <small className="card-subtitle">Your most recently completed coping strategy.</small>
                                    </div>
                                    {completedStrategies.length > 0 ? (
                                        <>
                                            <div className="accordion" id="latestStrategyAccordion">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="heading-latest">
                                                        <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapse-latest"
                                                            aria-expanded="false"
                                                            aria-controls="collapse-latest"
                                                        >
                                                            {completedStrategies[0].title}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id="collapse-latest"
                                                        className="accordion-collapse collapse"
                                                        aria-labelledby="heading-latest"
                                                        data-bs-parent="#latestStrategyAccordion"
                                                    >
                                                        <div className="accordion-body">
                                                            <ul className="mb-0">
                                                                {completedStrategies[0].steps?.map((step, i) => (
                                                                    <li key={i}>{step}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 d-flex justify-content-center">
                                                <a href="dashboard/strategies" className="btn btn-sm btn-outline-primary">
                                                    View All Strategies
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="pill-strategy-text text-muted">No completed strategies yet.</p>
                                    )}
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
