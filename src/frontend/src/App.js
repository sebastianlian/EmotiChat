import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
