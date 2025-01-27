import React from 'react';
import { useAuth } from '../components/AuthContext'; // Import AuthContext
import Sidebar from '../components/SideBar'; // Import the Sidebar component
import './pages_styles/ProgressPage.css';
import ChatPlacement from "../components/ChatPlacement"; // Optional: Add specific CSS for ProgressPage

const ProgressPage = () => {
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
                        <h1 className="main-title">Progress Page</h1>
                        <p>Welcome, {user?.firstname || 'User'}! Here's your progress overview.</p>
                    </div>
                    <div className="progress-content">
                        <div className="card">
                            <h5 className="card-title">Task 1</h5>
                            <p>Track the details of your first task here.</p>
                        </div>
                        <div className="card">
                            <h5 className="card-title">Task 2</h5>
                            <p>Track the details of your second task here.</p>
                        </div>
                        <div className="card">
                            <h5 className="card-title">Task 3</h5>
                            <p>Track the details of your third task here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </ChatPlacement>
    );
};

export default ProgressPage;
