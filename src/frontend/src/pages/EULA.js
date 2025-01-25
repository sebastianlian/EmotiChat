import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './pages_styles/EULA.css'; // EULA-specific CSS

const EULA = () => {
    const [eulaContent, setEulaContent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
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
            <div className="eula-page">
                <div className="eula-card">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="eula-page">
            <div className="eula-card">
                <ReactMarkdown
                    components={{
                        a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="eula-link">
                                {children}
                            </a>
                        ),
                    }}
                >
                    {eulaContent}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default EULA;
