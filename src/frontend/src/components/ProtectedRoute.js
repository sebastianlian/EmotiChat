import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming you're using an AuthContext

const ProtectedRoute = ({ children }) => {
    const { user, token, loading } = useAuth(); // Fetch user and loading state from context

    // Show a loading spinner while verifying authentication
    if (loading) {
        return <div>Loading...</div>;
    }

    // Redirect to login if the user is not authenticated
    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    // Render the protected content if authenticated
    return children;
};

export default ProtectedRoute;
