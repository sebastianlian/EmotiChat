import React from 'react';
import { Link } from 'react-router-dom';
import './pages_styles/Landing.css';
import Footer from '../components/Footer';
import NavBar from "../components/NavBar";

const Landing = () => {
    return (
        <>
            <div className="landing-page">
                <NavBar />
                <div className="landing-content text-center">
                    <h1 className="display-4">Welcome to EmotiChat</h1>
                    <p className="lead">
                        Your AI companion for managing depression. Get support anytime, anywhere.
                    </p>
                    <div className="button-group mt-4">
                        <Link to="/login" className="btn btn-dark me-2">Login</Link>
                        <Link to="/register" className="btn btn-outline-dark">Register</Link>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Landing;
