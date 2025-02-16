import React from 'react';
import { useAuth } from '../components/AuthContext'; // Import the AuthContext
import Sidebar from '../components/SideBar'; // Import the Sidebar component
import './pages_styles/Dashboard.css';
import { BsMoon, BsSun, BsCloudSun } from 'react-icons/bs';
import ChatPlacement from "../components/ChatPlacement";

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
                        <div className="row">
                            <div className="col-md-4">
                                <div className="card">
                                    <h5 className="card-title">Mood Trends</h5>
                                    <p>Your mood over the past week</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <h5 className="card-title">Recent Goals</h5>
                                    <p>Your latest objectives</p>
                                        <ul>
                                            <li>Text</li>
                                            <li>Text</li>
                                            <li>Text</li>
                                        </ul>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <h5 className="card-title">Chat Recommendations</h5>
                                    <p>Personalized suggestions based on your recent interactions</p>
                                    <ul>
                                        <li>Text</li>
                                        <li>Text</li>
                                        <li>Text</li>
                                    </ul>
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
