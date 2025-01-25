import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import './pages_styles/EULA.css'; // Assuming you have a separate CSS file for EULA styling

const EULA = () => {
    const [eulaContent, setEulaContent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the EULA.md file from the public directory
        fetch('/EULA.md')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load EULA content');
                }
                return response.text();
            })
            .then((text) => setEulaContent(text))
            .catch((error) => {
                console.error(error);
                setError('Unable to load the End-User License Agreement at this time.');
            });
    }, []);

    if (error) {
        return (
            <div className="landing-page">
                <div className="landing-content">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="landing-page">
            <div className="landing-content">
                {/*<h1 className="display-4">End-User License Agreement (EULA)</h1>*/}
                <div className="eula-content lead" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <ReactMarkdown>{eulaContent}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default EULA;
