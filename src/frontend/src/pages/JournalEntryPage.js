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
    const [showNewEntry, setShowNewEntry] = useState(false);
    const [newEntryText, setNewEntryText] = useState("");
    const [newEntryEmotion, setNewEntryEmotion] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [editedEmotion, setEditedEmotion] = useState("");


    useEffect(() => {
        fetchEntries();
    }, [user]);

    const fetchEntries = async () => {
        if (!user?.username) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/journal/entries/${user.username}`);
            setEntries(res.data.entries || []);
        } catch (err) {
            console.error("Failed to fetch journal entries", err);
        }
    };

    const handleSaveNewEntry = async () => {
        if (!newEntryText || !newEntryEmotion) {
            alert("Please write something and select an emotion.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/journal/entry", {
                username: user.username,
                entry: newEntryText,
                emotion: newEntryEmotion
            });

            await fetchEntries();
            setNewEntryText("");
            setNewEntryEmotion("");
            setShowNewEntry(false);
        } catch (error) {
            console.error("Error saving new journal entry:", error);
            alert("Failed to save your entry.");
        }
    };

    const handleSaveEdit = async (entryId) => {
        if (!editedText || !editedEmotion) return;
        try {
            await axios.put(`http://localhost:5000/api/journal/entry/${entryId}`, {
                entry: editedText,
                emotion: editedEmotion
            });
            await fetchEntries();
            setEditIndex(null);
            setEditedText("");
            setEditedEmotion("")
        } catch (err) {
            console.error("Error saving edited entry:", err);
            alert("Failed to update the entry.");
        }
    };

    const groupedEntries = entries.reduce((acc, entry) => {
        const dateKey = new Date(entry.timestamp).toLocaleDateString();
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(entry);
        return acc;
    }, {});


    return (
        <ChatPlacement username={user?.username}>
            <div className="journal-wrapper">
                <Sidebar handleLogout={() => { window.location.href = '/login'; }} />

                <div className="main-content">
                    <div className="progress-header">
                        <h1 className="main-title">Journal Entries</h1>
                        <p>A reflective space to explore how you've been feeling.</p>
                    </div>

                    <div className="mb-4 text-end">
                        <div className="mt-2 d-flex justify-content-end gap-2 flex-wrap">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setShowNewEntry(!showNewEntry)}
                            >
                                {showNewEntry ? "Close Entry Form" : "New Journal Entry"}
                            </button>
                        </div>
                    </div>

                    {showNewEntry && (
                        <div className="card journal-entry-card new-entry-form">
                            <div className="entry-meta mb-2">
                                <select
                                    className="form-select w-50"
                                    value={newEntryEmotion}
                                    onChange={(e) => setNewEntryEmotion(e.target.value)}
                                >
                                    <option value="">Select Emotion</option>
                                    {["Joy", "Excitement", "Calm", "Anxiety", "Sadness",
                                        "Frustration", "Overwhelm", "Hopeful", "Tired", "Motivated"].map((emotion, idx) => (
                                        <option key={idx} value={emotion}>{emotion}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                className="form-control handwriting-textarea"
                                rows="6"
                                placeholder="Write your thoughts here..."
                                value={newEntryText}
                                onChange={(e) => setNewEntryText(e.target.value)}
                            />
                            <div className="mt-2 d-flex justify-content-end gap-2 flex-wrap">
                                <button className="btn btn-secondary btn-sm w-auto"
                                        onClick={() => setShowNewEntry(false)}>Cancel
                                </button>
                                <button className="btn sucess btn-sm w-auto" onClick={handleSaveNewEntry}>Save Entry
                                </button>
                            </div>
                        </div>
                    )}

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

                    <div className="journal-entries-container">
                        {Object.keys(groupedEntries).length === 0 ? (
                            <div className="card">
                                <p>No entries yet. Start journaling to see them here!</p>
                            </div>
                        ) : (
                            Object.entries(groupedEntries).map(([date, dayEntries]) => (
                                <div key={date} className="day-section mb-4">
                                    <h4 className="mb-3">{date}</h4>

                                    <div className="row">
                                        {dayEntries
                                            .filter(entry => !selectedEmotionFilter || entry.emotion === selectedEmotionFilter)
                                            .map((entry, idx) => (
                                                <div key={entry._id || idx} className="col-md-6 mb-4 d-flex lead">
                                                    <div className="card journal-entry-card flex-fill">
                                                        <div className="entry-meta d-flex justify-content-between">
                                                            <span className="journal-date">
                                                                {new Date(entry.timestamp).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                            <span className="emotion-tag">{entry.emotion}</span>
                                                        </div>

                                                        {editIndex === entry._id ? (
                                                            <>
                                                                <div className="entry-meta mb-2">
                                                                    <select
                                                                        className="form-select w-auto"
                                                                        value={editedEmotion}
                                                                        onChange={(e) => setEditedEmotion(e.target.value)}
                                                                    >
                                                                        {["Joy", "Excited", "Calm", "Anxious", "Sad",
                                                                            "Frustrated", "Overwhelmed", "Hopeful", "Tired", "Motivated"]
                                                                            .map((emotion, idx) => (
                                                                                <option key={idx}
                                                                                        value={emotion}>{emotion}</option>
                                                                            ))}
                                                                    </select>
                                                                </div>
                                                                <textarea
                                                                    className="form-control handwriting-textarea"
                                                                    rows="6"
                                                                    value={editedText}
                                                                    onChange={(e) => setEditedText(e.target.value)}
                                                                />
                                                                <div
                                                                    className="mt-2 d-flex justify-content-center gap-2 flex-wrap">
                                                                    <button
                                                                        className="btn btn-secondary btn-sm w-auto"
                                                                        onClick={() => setEditIndex(null)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-success btn-sm w-auto"
                                                                        onClick={() => handleSaveEdit(entry._id)}
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="entry-text">{entry.entry}</p>
                                                                <div
                                                                    className="mt-autp d-flex justify-content-center gap-2 flex-wrap">
                                                                    <button
                                                                        className="btn btn-outline-primary btn-sm w-auto"
                                                                        onClick={() => {
                                                                            setEditIndex(entry._id);
                                                                            setEditedText(entry.entry);
                                                                            setEditedEmotion(entry.emotion);
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
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
