import React from 'react';
import { useLocation } from 'react-router-dom';
import './components_styles/SideBar.css';
import { BsHouse, BsChat, BsBarChart, BsListTask, BsGear, BsBoxArrowLeft } from 'react-icons/bs';

const Sidebar = ({ handleLogout }) => {
    const location = useLocation();

    return (
        <div className="sidebar">
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a
                        href="/dashboard"
                        className={`nav-link ${location.pathname === '/dashboard' ? 'active disabled' : ''}`}
                    >
                        <BsHouse className="sidebar-icon" /> Home
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="/dashboard/progress"
                        className={`nav-link ${location.pathname === '/dashboard/progress' ? 'active disabled' : ''}`}
                    >
                        <BsBarChart className="sidebar-icon" /> Progress
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="#todo"
                        className={`nav-link ${location.pathname === '/goals' ? 'active disabled' : ''}`}
                    >
                        <BsListTask className="sidebar-icon" /> Goals
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="#settings"
                        className={`nav-link ${location.pathname === '/settings' ? 'active disabled' : ''}`}
                    >
                        <BsGear className="sidebar-icon" /> Settings
                    </a>
                </li>
            </ul>
            <button className="nav-link logout" onClick={handleLogout}>
                <BsBoxArrowLeft className="sidebar-icon" /> Logout
            </button>
        </div>
    );
};

export default Sidebar;
