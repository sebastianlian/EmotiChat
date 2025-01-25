// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import Landing from './pages/Landing';
// import Register from './pages/Register';
// import { AuthProvider } from './components/AuthContext';
// import { DarkModeProvider } from './components/DarkModeContext'; // Import DarkModeProvider
// import ProtectedRoute from './components/ProtectedRoute';
// import ProgressPage from './pages/ProgressPage';
// import SettingsPage from './pages/SettingsPage';
//
// const App = () => (
//     <DarkModeProvider>
//         <AuthProvider>
//             <Router>
//                 <Routes>
//                     <Route path="/" element={<Landing />} />
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/register" element={<Register />} />
//                     <Route
//                         path="/dashboard"
//                         element={
//                             <ProtectedRoute>
//                                 <Dashboard />
//                             </ProtectedRoute>
//                         }
//                     />
//                     <Route
//                         path="/dashboard/progress"
//                         element={
//                             <ProtectedRoute>
//                                 <ProgressPage />
//                             </ProtectedRoute>
//                         }
//                     />
//                     <Route
//                         path="/dashboard/settings"
//                         element={
//                             <ProtectedRoute>
//                                 <SettingsPage />
//                             </ProtectedRoute>
//                         }
//                     />
//                 </Routes>
//             </Router>
//         </AuthProvider>
//     </DarkModeProvider>
// );
//
//
// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import { AuthProvider } from './components/AuthContext';
import { DarkModeProvider } from './components/DarkModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import GoalsPage from './pages/GoalsPage';
import EULA from './pages/EULA';


const App = () => {
    const location = useLocation();

    React.useEffect(() => {
        const excludedRoutes = ['/login', '/register', '/'];
        const isExcluded = excludedRoutes.includes(location.pathname);

        if (isExcluded) {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }, [location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/eula" element={<EULA />} />
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
                path="/dashboard/goals"
                element={
                    <ProtectedRoute>
                        <GoalsPage />
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
