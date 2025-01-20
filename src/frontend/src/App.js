import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import { AuthProvider } from './components/AuthContext';
import { DarkModeProvider } from './components/DarkModeContext'; // Import DarkModeProvider
import ProtectedRoute from './components/ProtectedRoute';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';

const App = () => (
    <DarkModeProvider>
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
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
                        path="/dashboard/settings"
                        element={
                            <ProtectedRoute>
                                <SettingsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    </DarkModeProvider>
);


export default App;
