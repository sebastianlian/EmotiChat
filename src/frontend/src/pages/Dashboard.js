import React from 'react';
import './pages_styles/Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <h2 className="sidebar-title">EmotiChat</h2>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a href="#home" className="nav-link active">
                            <i className="bi bi-house"></i> Home
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#chat" className="nav-link">
                            <i className="bi bi-chat"></i> Chat
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#progress" className="nav-link">
                            <i className="bi bi-bar-chart"></i> Progress
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#settings" className="nav-link">
                            <i className="bi bi-gear"></i> Settings
                        </a>
                    </li>
                </ul>
                <a href="#logout" className="nav-link logout">
                    <i className="bi bi-box-arrow-left"></i> Logout
                </a>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <h1 className="main-title">Dashboard</h1>
                <div className="row">
                    {/* Chat Card */}
                    <div className="col-md-8">
                        <div className="card">
                            <h5 className="card-title">Chat with Your Assistant</h5>
                            <div className="chat-window">
                                {/* Placeholder chat area */}
                            </div>
                            <div className="chat-input">
                                <input type="text" className="form-control" placeholder="Type your message..." />
                                <button className="btn btn-dark">Send</button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="col-md-4">
                        <div className="card">
                            <h5 className="card-title">Your Progress</h5>
                            <p>Progress tracking features will be implemented here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
