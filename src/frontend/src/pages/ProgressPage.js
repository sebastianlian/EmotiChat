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
                        {/* TODO: Need to work on assigning roles for clinician dashboard to have access to staff roles (clinicians/therapists) they should be able to access certain pages the user role can't */}
                        <h1 className="main-title">Progress Page</h1>
                        <p>Welcome, {user?.firstname || 'User'}! Here's your progress overview.</p>
                    </div>
                    <div className="progress-content">
                        <div className="card">
                            <h5 className="card-title">Mental State Analysis</h5>
                            <p>Your current mental state based on recent interactions</p>
                        </div>
                        {/* TODO: Create the Journal tab for users to log their emotions and type in the notebook. The notebook should also have an ai-analytical feature */}
                        {/*<div className="card">*/}
                        {/*    <h5 className="card-title">Emotion Tracking Journal</h5>*/}
                        {/*    <p>Record your thoughts and feelings</p>*/}
                        {/*</div>*/}
                        <div className="card">
                            <h5 className="card-title">Mental State Trends</h5>
                            <p>Mood and stress over time</p>
                        </div>
                        <div className="card">
                            <h5 className="card-title">Weekly Summary</h5>
                            <p>View your weekly mood summaries</p>
                        </div>
                        <div className="card">
                            <h5 className="card-title">Anomaly Detection</h5>
                            <p>Potential issues detected that may require clinician attention</p>
                        </div>
                    </div>
                </div>
            </div>
        </ChatPlacement>
    );
};

export default ProgressPage;
