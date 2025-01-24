import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the Dark Mode Context
const DarkModeContext = createContext();

// Custom hook for accessing the context
export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        console.error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};

// Provider Component
export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode') === 'true';
        console.log('Initializing darkMode from localStorage:', savedMode);
        return savedMode;
    });

    useEffect(() => {
        console.log('Applying dark mode:', darkMode);
        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        console.log('Toggling dark mode'); // Add this log
        const newMode = !darkMode;
        setDarkMode(newMode);
        console.log('darkMode updated to:', newMode); // Add this log
    };

    // Reset dark mode to default (light mode)
    const resetDarkMode = () => {
        setDarkMode(false);
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.removeItem('darkMode');
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, resetDarkMode}}>
            {children}
        </DarkModeContext.Provider>
    );
};
