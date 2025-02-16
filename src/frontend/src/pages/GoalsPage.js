import React from 'react';
import { useAuth } from '../components/AuthContext'; // Import AuthContext
import Sidebar from '../components/SideBar'; // Import the Sidebar component
import './pages_styles/GoalsPage.css';
import ChatPlacement from "../components/ChatPlacement";

const GoalsPage = () => {
    const { user } = useAuth(); // Get user details if needed

    return (
        <ChatPlacement>
            <div className="progress-page-wrapper">
                {/* Sidebar */}
                <Sidebar handleLogout={() => {
                    window.location.href = '/login';
                }} />

                {/* Main Content */}
                <div className="main-content">
                    <div className="progress-header">
                        <h1 className="main-title">Goals Page</h1>
                        <p>Welcome, {user?.firstname || 'User'}! Here's your goals overview.</p>
                    </div>
                    <div className="progress-content">
                        <div className="card">
                            <h5 className="card-title">Recent Conversation</h5>
                            <p>Recent conversation will populate here</p>
                        </div>
                        <div className="card">
                            <h5 className="card-title">Coping Strategies</h5>
                            <p>Cards will populate here</p>
                        </div>
                    </div>
                </div>
            </div>
        </ChatPlacement>
    );
};

export default GoalsPage;
