import React from 'react';
import { useAuth } from '../components/AuthContext'; // Import the AuthContext
import { useLocation } from 'react-router-dom'; // Import useLocation
import './pages_styles/Dashboard.css';
import { BsMoon, BsSun, BsCloudSun } from 'react-icons/bs'; // Icons for light and dark mode toggle

const Dashboard = () => {
    const { user, logout } = useAuth(); // Access user information from AuthContext
    const location = useLocation(); // Get the current location
    const currentHour = new Date().getHours(); // Get the current hour
    const [darkMode, setDarkMode] = React.useState(false); // Dark mode state

    // Load dark mode preference from localStorage on initial render
    React.useEffect(() => {
        const savedMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedMode);
        document.body.classList.toggle('dark-mode', savedMode);
        document.body.classList.toggle('light-mode', !savedMode);
    }, []);

    const handleLogout = () => {
        logout(); // Call the logout function from AuthContext
        // Redirect to the login or landing page if needed
        window.location.href = '/login'; // Replace with your desired route
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        document.body.classList.toggle('light-mode', !newMode);
        localStorage.setItem('darkMode', newMode); // Save to localStorage
    };

    // Determine the greeting based on the time of day
    const getGreeting = () => {
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Determine the icon based on the time of day
    const getGreetingIcon = () => {
        if (currentHour < 12) return <BsSun className="time-icon" />;
        if (currentHour < 18) return <BsCloudSun className="time-icon" />;
        return <BsMoon className="time-icon" />;
    };

    return (
        <div className="dashboard-wrapper">
            {/* Dark Mode Toggle */}
            <div className="dark-mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? <BsSun className="toggle-icon sun" /> : <BsMoon className="toggle-icon moon" />}
            </div>

            <div className="dashboard-container">
                {/* Sidebar */}
                <div className="sidebar">
                    {/*<h2 className="sidebar-title">EmotiChat</h2>*/}
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a
                                href="#home"
                                className={`nav-link ${location.pathname === '/dashboard' ? 'active disabled' : ''}`}
                            >
                                <i className="bi bi-house"></i> Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="#chat"
                                className={`nav-link ${location.pathname === '/chat' ? 'active disabled' : ''}`}
                            >
                                <i className="bi bi-chat"></i> Chat
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="#progress"
                                className={`nav-link ${location.pathname === '/progress' ? 'active disabled' : ''}`}
                            >
                                <i className="bi bi-bar-chart"></i> Progress
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                href="#settings"
                                className={`nav-link ${location.pathname === '/settings' ? 'active disabled' : ''}`}
                            >
                                <i className="bi bi-gear"></i> Settings
                            </a>
                        </li>
                    </ul>
                    <button className="nav-link logout" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-left"></i> Logout
                    </button>

                </div>

                {/* Main Content */}
                <div className="main-content">
                    <div className="welcome-banner fade-in">
                        <h1 className="welcome-message">
                            {getGreeting()} {getGreetingIcon()}, {user?.firstname || 'User'}!
                        </h1>
                    </div>
                    <h1 className="main-title">Quick View</h1>
                    <div className="row">
                        {/* Example Cards */}
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
    );
};

export default Dashboard;
