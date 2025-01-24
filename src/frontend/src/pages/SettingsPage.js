import React, { useState } from 'react';
import Sidebar from '../components/SideBar';
import { useDarkMode } from '../components/DarkModeContext';
import './pages_styles/SettingsPage.css';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const SettingsPage = () => {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const { user, token } = useAuth();

    // State for the password field
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // State for editable fields
    const [editableUserInfo, setEditableUserInfo] = useState({
        gender: user?.gender || '',
        pronouns: user?.pronouns || '',
        email: user?.email || '',
    });

    // Handle password update
    const handlePasswordUpdate = async () => {
        if (!password || password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await axios.put(
                'http://localhost:5000/api/auth/update-password',
                { password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message || 'Password updated successfully!');
            setPassword(''); // Clear the password field after update
        } catch (err) {
            console.error('Failed to update password:', err);
            alert('Failed to update password. Please try again.');
        }
    };

    // Handle other fields update
    const handleUserInfoUpdate = async () => {
        try {
            const response = await axios.put(
                'http://localhost:5000/api/auth/update-info',
                { ...editableUserInfo },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(response.data.message || 'Information updated successfully!');
        } catch (err) {
            console.error('Failed to update user information:', err);
            alert('Failed to update information. Please try again.');
        }
    };

    return (
        <div className="settings-page-wrapper">
            <Sidebar
                handleLogout={() => {
                    window.location.href = '/login';
                }}
            />

            <div className="settings-content">
                <h1 className="settings-title">Account Settings</h1>
                <p className="settings-subtitle">
                    Manage your account preferences and privacy settings.
                </p>

                <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
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
                        <label htmlFor="gender">Gender</label>
                        <input
                            type="text"
                            id="gender"
                            value={editableUserInfo.gender}
                            onChange={(e) =>
                                setEditableUserInfo({...editableUserInfo, gender: e.target.value})
                            }
                        />
                    </div>

                    <div className="settings-group">
                        <label htmlFor="pronouns">Pronouns</label>
                        <input
                            type="text"
                            id="pronouns"
                            value={editableUserInfo.pronouns}
                            onChange={(e) =>
                                setEditableUserInfo({
                                    ...editableUserInfo,
                                    pronouns: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="settings-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={`${user?.username}`}
                            readOnly
                        />
                    </div>

                    <div className="settings-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={editableUserInfo.email}
                            onChange={(e) =>
                                setEditableUserInfo({...editableUserInfo, email: e.target.value})
                            }
                        />
                    </div>

                    <div className="settings-group">
                        <label htmlFor="password">New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                {isPasswordVisible ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="settings-group">
                        <label htmlFor="darkMode">Dark Mode</label>
                        <div className="switch">
                            <input
                                type="checkbox"
                                id="darkMode"
                                checked={darkMode}
                                onChange={toggleDarkMode}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="btn"
                        onClick={handlePasswordUpdate}
                        style={{marginBottom: '1rem'}}
                    >
                        Update Password
                    </button>
                    <button
                        type="button"
                        className="btn"
                        onClick={handleUserInfoUpdate}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
