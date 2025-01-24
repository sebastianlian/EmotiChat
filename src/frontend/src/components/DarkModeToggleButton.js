// NOT USED CURRENTLY
// import React, { useState, useEffect } from 'react';
// import './components_styles/DarkModeToggleButton.css'; // Add CSS for light/dark themes
// import { BsSun, BsMoon } from 'react-icons/bs'; // React icons for toggle
//
// const DarkModeToggleButton = () => {
//     const [darkMode, setDarkMode] = useState(false);
//
//     // Load saved theme from localStorage
//     useEffect(() => {
//         const savedTheme = localStorage.getItem('darkMode') === 'true';
//         setDarkMode(savedTheme);
//         document.body.className = savedTheme ? 'dark-mode' : 'light-mode';
//     }, []);
//
//     // Toggle theme
//     const toggleDarkMode = () => {
//         setDarkMode((prevMode) => !prevMode);
//         document.body.className = !darkMode ? 'dark-mode' : 'light-mode';
//         localStorage.setItem('darkMode', !darkMode);
//     };
//
//     return (
//         <div className="app-container">
//             {/* Dark Mode Toggle Button */}
//             <div className="dark-mode-toggle" onClick={toggleDarkMode}>
//                 {darkMode ? (
//                     <BsSun className="toggle-icon sun" />
//                 ) : (
//                     <BsMoon className="toggle-icon moon" />
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default DarkModeToggleButton;
