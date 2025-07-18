import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './pages_styles/Landing.css';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

const Landing = () => {
    const sectionRefs = useRef([]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    return (
        <>
            <div className="landing-page">
                <NavBar/>
                <div className="hero-banner">
                    <div className="landing-content text-center">
                        <h1 className="display-2">Welcome to EmotiChat</h1>
                        <p className="lead">
                            Your AI companion for managing your mental health. Get support anytime, anywhere.
                        </p>
                        <div className="button-group m-0">
                            <Link to="/login" className="btn btn-dark me-2">Login</Link>
                            <Link to="/register" className="btn btn-dark me-2">Register</Link>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <section id="about" className="landing-section" ref={el => sectionRefs.current[0] = el}>
                    <h2 className="display-4">About</h2>
                    <p>
                        EmotiChat is an AI-powered mental health platform designed to support emotional well-being
                        through intelligent conversation and personalized analytics.
                        It helps users recognize patterns in their mood and behavior using sentiment analysis and
                        anomaly detection extracted from their data.
                    </p>
                    <p>
                        Our goal is to provide a safe, always-available space for individuals to express themselves,
                        receive tailored coping strategies, and monitor their progress over time.
                        Whether you're between therapy sessions or just need to talk, EmotiChat is here to help.
                    </p>
                    <p>
                        EmotiChat is not a replacement for clinical treatment but serves as a powerful companion tool to
                        enhance self-awareness and bridge the gap in care.
                    </p>
                </section>


                {/* Features Section */}
                <section id="features" className="landing-section" ref={el => sectionRefs.current[1] = el}>
                    <h2 className="display-4">Features</h2>
                    <ul className="features">
                        <li><i className="bi bi-chat-dots"></i> AI-powered chatbot available 24/7 for mental health
                            conversations
                        </li>
                        <li><i className="bi bi-journal-text"></i> Mood journal for daily emotional reflections and
                            progress tracking
                        </li>
                        <li><i className="bi bi-bar-chart-line"></i> Real-time sentiment analysis and mood visualization
                        </li>
                        <li><i className="bi bi-exclamation-diamond"></i> Anomaly detection to flag emotional distress
                            and sudden mood changes
                        </li>
                        <li><i className="bi bi-check2-circle"></i> Personalized coping strategies, goals, and
                            mindfulness techniques
                        </li>
                        <li><i className="bi bi-pie-chart"></i> Dashboard with emotion trends and daily mood insights
                        </li>
                        <li><i className="bi bi-shield-lock"></i> End-to-end encryption for secure and confidential
                            interactions
                        </li>
                        <li><i className="bi bi-activity"></i> Future Clinician Dashboard featuring AI-generated summaries
                            and anomaly alert notifications to monitor patient progress
                        </li>
                    </ul>
                </section>


                {/* Contact Section */}
                <section id="contact" className="landing-section" ref={el => sectionRefs.current[2] = el}>
                    <h2 className="display-4">Contact Us</h2>
                    <p>
                        Have questions or need help? Reach out to our team at:
                        <br/>
                        <a href="mailto:info@emotichat.tech ">support@emotichat.tech</a>
                    </p>
                </section>

                <Footer/>
            </div>
        </>
    );
};

export default Landing;