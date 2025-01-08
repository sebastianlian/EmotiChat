import React from 'react';
import { Link } from 'react-router-dom';
import './pages_styles/Landing.css';

const Landing = () => {
    return (
        <div className="landing-page d-flex justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="display-4">Welcome to EmotiChat</h1>
                <p className="lead">
                    Your personal companion for managing depression and improving mental well-being.
                </p>
                <div className="button-group mt-4">
                    <Link to="/login" className="btn btn-dark me-2">
                        Login
                    </Link>
                    <Link to="/register" className="btn btn-outline-dark">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
