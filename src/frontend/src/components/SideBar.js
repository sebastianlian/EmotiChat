import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
// import { useDarkMode } from './DarkModeContext'; // Import Dark Mode context
import './components_styles/SideBar.css';
import {
    BsHouse,
    BsBarChart,
    BsListTask,
    BsGear,
    BsBoxArrowLeft,
    BsArrowLeftRight,
    BsMoon,
    BsSun,
} from 'react-icons/bs';

const Sidebar = ({ handleLogout }) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false); // State to toggle sidebar collapse
    // const { darkMode, toggleDarkMode } = useDarkMode(); // Access dark mode state and toggle function

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Collapse Button */}
            <button
                className="collapse-btn"
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle Sidebar"
            >
                <BsArrowLeftRight className="collapse-icon"/>
            </button>

            {/* Navigation Links */}
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a
                        href="/dashboard"
                        className={`nav-link ${location.pathname === '/dashboard' ? 'active disabled' : ''}`}
                    >
                        <BsHouse className="sidebar-icon"/> {!collapsed && 'Home'}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="/dashboard/progress"
                        className={`nav-link ${location.pathname === '/dashboard/progress' ? 'active disabled' : ''}`}
                    >
                        <BsBarChart className="sidebar-icon"/> {!collapsed && 'Progress'}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="/dashboard/goals"
                        className={`nav-link ${location.pathname === '/goals' ? 'active disabled' : ''}`}
                    >
                        <BsListTask className="sidebar-icon"/> {!collapsed && 'Goals'}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="/dashboard/settings"
                        className={`nav-link ${location.pathname === '/settings' ? 'active disabled' : ''}`}
                    >
                        <BsGear className="sidebar-icon"/> {!collapsed && 'Settings'}
                    </a>
                </li>
            </ul>

            {/*/!* Dark Mode Toggle *!/*/}
            {/*<button className="nav-link dark-mode-toggle" onClick={toggleDarkMode}>*/}
            {/*    {darkMode ? (*/}
            {/*        <BsSun className="sidebar-icon"/>*/}
            {/*    ) : (*/}
            {/*        <BsMoon className="sidebar-icon"/>*/}
            {/*    )}*/}
            {/*    {!collapsed && <span>{darkMode ? <BsSun className="sidebar-icon"/> : <BsMoon className="sidebar-icon"/>}</span>}*/}
            {/*</button>*/}


            {/* Logout Button */}
            <button className="nav-link logout" onClick={handleLogout}>
                <BsBoxArrowLeft className="sidebar-icon"/> {!collapsed && 'Logout'}
            </button>
        </div>
    );
};

export default Sidebar;
