import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProgressPage from "./pages/ProgressPage";

const App = () => (
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
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
