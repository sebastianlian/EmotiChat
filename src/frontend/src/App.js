import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import * as bootstrap from 'bootstrap';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import { AuthProvider } from './components/AuthContext';
import { DarkModeProvider } from './components/DarkModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import CopingStratPage from './pages/CopingStratPage';
import EULA from './pages/EULA';
import Privacy from "./pages/Privacy";
import JournalEntryPage from "./pages/JournalEntryPage";
import ChatPage from "./pages/ChatPage";


const App = () => {
    const location = useLocation();

    React.useEffect(() => {
        const excludedRoutes = ['/login', '/register', '/'];
        const isExcluded = excludedRoutes.includes(location.pathname);

        if (isExcluded) {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }

        // Enable Bootstrap tooltips
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(el => {
            new bootstrap.Tooltip(el);
        });
    }, [location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/eula" element={<EULA />} />
            <Route path="/privacy" element={<Privacy />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/progress"
                element={
                    <ProtectedRoute>
                        <ProgressPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/strategies"
                element={
                    <ProtectedRoute>
                        <CopingStratPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/settings"
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/journal"
                element={
                    <ProtectedRoute>
                        <JournalEntryPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/chat"
                element={
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default () => (
    <DarkModeProvider>
        <AuthProvider>
            <Router>
                <App />
            </Router>
        </AuthProvider>
    </DarkModeProvider>
);
