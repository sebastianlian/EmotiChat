import React from 'react';
import Sidebar from '../components/SideBar';
import { useDarkMode } from '../components/DarkModeContext'; // Import the `useDarkMode` hook
import './pages_styles/SettingsPage.css';
import { useAuth } from '../components/AuthContext';

const SettingsPage = () => {
    const { darkMode, toggleDarkMode } = useDarkMode(); // Use the DarkMode context values
    const { user } = useAuth();

    return (
        <div className="settings-page-wrapper">
            {/* Sidebar */}
            <Sidebar handleLogout={() => {
                window.location.href = '/login';
            }} />

            {/* Main Content */}
            <div className="settings-content">
                <h1 className="settings-title">Account Settings</h1>
                <p className="settings-subtitle">Manage your account preferences and privacy settings.</p>

                <form className="settings-form">
                    <div className="settings-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={`${user?.firstname || ''} ${user?.lastname || ''}`}
                            readOnly
                        />
                    </div>
                    <div className="settings-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={user?.email || ''}
                            readOnly
                        />
                    </div>
                    <div className="settings-group">
                        <label htmlFor="darkMode">Dark Mode</label>
                        <div className="switch">
                            <input
                                type="checkbox"
                                id="darkMode"
                                checked={darkMode} // Use `darkMode` state
                                onChange={() => {
                                    console.log('Switch toggled:', !darkMode); // Debug message
                                    toggleDarkMode(); // Toggle dark mode
                                }}
                            />
                            {/*<span className="slider"></span>*/}
                        </div>
                    </div>
                    <button type="button" className="btn">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
