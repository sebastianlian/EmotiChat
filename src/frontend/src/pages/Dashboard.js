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
                        <h1 className="main-title">Quick View</h1>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="card">
                                    <h5 className="card-title">Your Progress</h5>
                                    <p>Track your progress here.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <h5 className="card-title">Your Goals</h5>
                                    <p>Set your goals for the day!</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card">
                                    <h5 className="card-title">Your Stats</h5>
                                    <p>View your stats and activity insights.</p>
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
