import React from 'react';
import { useAuth } from '../components/AuthContext'; // Import the AuthContext
import Sidebar from '../components/SideBar'; // Import the Sidebar component
import './pages_styles/Dashboard.css';
import { BsMoon, BsSun, BsCloudSun } from 'react-icons/bs';
import DashboardLayout from "../components/ChatPlacement";
import ChatPlacement from "../components/ChatPlacement";

const Dashboard = () => {
    const { user, logout } = useAuth(); // Access user information from AuthContext
    const currentHour = new Date().getHours(); // Get the current hour
    // const [darkMode, setDarkMode] = React.useState(false); // Dark mode state

    // React.useEffect(() => {
    //     const savedMode = localStorage.getItem('darkMode') === 'true';
    //     setDarkMode(savedMode);
    //     document.body.classList.toggle('dark-mode', savedMode);
    //     document.body.classList.toggle('light-mode', !savedMode);
    // }, []);

    const handleLogout = () => {
        logout();
        window.location.href = '/login'; // Redirect to login
    };

    // const toggleDarkMode = () => {
    //     const newMode = !darkMode;
    //     setDarkMode(newMode);
    //     document.body.classList.toggle('dark-mode', newMode);
    //     document.body.classList.toggle('light-mode', !newMode);
    //     localStorage.setItem('darkMode', newMode);
    // };

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
        <ChatPlacement>
        <div className="dashboard-wrapper">
            {/*/!* Dark Mode Toggle *!/*/}
            {/*<div className="dark-mode-toggle" onClick={toggleDarkMode}>*/}
            {/*    {darkMode ? <BsSun className="toggle-icon sun" /> : <BsMoon className="toggle-icon moon" />}*/}
            {/*</div>*/}

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
