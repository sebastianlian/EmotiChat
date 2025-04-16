import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import Sidebar from '../components/SideBar';
import ChatPlacement from '../components/ChatPlacement';
import './pages_styles/JournalEntryPage.css';

const JournalEntriesPage = () => {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [selectedEmotionFilter, setSelectedEmotionFilter] = useState("");

    useEffect(() => {
        const fetchEntries = async () => {
            if (!user?.username) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/journal/entries/${user.username}`);
                setEntries(res.data.entries || []);
            } catch (err) {
                console.error("Failed to fetch journal entries", err);
            }
        };

        fetchEntries();
    }, [user]);

    return (
        <ChatPlacement username={user?.username}>
            <div className="journal-wrapper">
                <Sidebar handleLogout={() => { window.location.href = '/login'; }} />

                <div className="main-content">
                    <div className="progress-header">
                        <h1 className="main-title">Journal Entries</h1>
                        <p>A reflective space to explore how you've been feeling.</p>
                    </div>

                    {/* Filter Bar */}
                    <div className="filter-bar d-flex align-items-center mb-3">
                        <label htmlFor="emotionFilter" className="me-2"><b>Filter by Emotion:</b></label>
                        <select
                            id="emotionFilter"
                            className="form-select w-auto"
                            value={selectedEmotionFilter}
                            onChange={(e) => setSelectedEmotionFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            {[...new Set(entries.map(e => e.emotion))].map((emotion, index) => (
                                <option key={index} value={emotion}>{emotion}</option>
                            ))}
                        </select>
                    </div>

                    {/* Entries List */}
                    <div className="journal-entries-container">
                        {entries.length === 0 ? (
                            <div className="card">
                                <p>No entries yet. Start journaling to see them here!</p>
                            </div>
                        ) : (
                            entries
                                .filter(entry => !selectedEmotionFilter || entry.emotion === selectedEmotionFilter)
                                .map((entry, idx) => (
                                    <div key={idx} className="card journal-entry-card">
                                        <div className="entry-meta d-flex justify-content-between">
                                            <span className="journal-date">
                                                {new Date(entry.timestamp).toLocaleString()}
                                            </span>
                                            <span className="emotion-tag">{entry.emotion}</span>
                                        </div>
                                        <p className="entry-text">{entry.entry}</p>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </ChatPlacement>
    );
};

export default JournalEntriesPage;
