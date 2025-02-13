import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './pages_styles/Privacy.css';

const Privacy = () => {
    const [privacyContent, setPrivacyContent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/Privacy.md')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to load Privacy Policy');
                }
                return response.text();
            })
            .then((text) => setPrivacyContent(text))
            .catch((error) => {
                console.error(error);
                setError('Unable to load the Privacy Policy at this time.');
            });
    }, []);

    if (error) {
        return (
            <div className="privacy-page">
                <div className="privacy-card">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="privacy-page">
            <div className="privacy-card">
                <ReactMarkdown
                    components={{
                        a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="privacy-link">
                                {children}
                            </a>
                        ),
                    }}
                >
                    {privacyContent}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default Privacy;