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
                <NavBar />
                <div className="landing-content text-center">
                    <h1 className="display-2">Welcome to EmotiChat</h1>
                    <p className="lead">
                        Your AI companion for managing your mental health. Get support anytime, anywhere.
                    </p>
                    <div className="button-group mt-4">
                        <Link to="/login" className="btn btn-dark me-2">Login</Link>
                        <Link to="/register" className="btn btn-outline-dark">Register</Link>
                    </div>
                </div>

                {/* About Section */}
                <section id="about" className="landing-section" ref={el => sectionRefs.current[0] = el}>
                    <h2 className="display-4">About</h2>
                    <p>
                        EmotiChat is an innovative AI-powered platform designed to provide accessible mental health support,
                        focusing on depression management. Our mission is to bridge the gap in mental health care, offering
                        support to those who may not have immediate access to traditional therapy.
                    </p>
                    <p>
                        EmotiChat aims to provide a safe, confidential space for individuals to express their thoughts and
                        feelings, receive support, and learn coping strategies.
                    </p>
                    <p>
                        While EmotiChat is not a replacement for professional mental health treatment, it serves as a valuable
                        complementary tool, offering support during off-hours or between therapy sessions.
                    </p>
                </section>

                {/* Features Section */}
                <section id="features" className="landing-section" ref={el => sectionRefs.current[1] = el}>
                    <h2 className="display-4">Features</h2>
                    <ul className="features">
                        <li><i className="bi bi-chat-dots"></i> 24/7 AI-powered chat support for emotional support and
                            mental wellness
                        </li>
                        <li><i className="bi bi-person"></i> Personalized coping strategies, mindfulness exercises, and
                            goal-setting
                        </li>

                        <li><i className="bi bi-graph-up-arrow"></i> Mood tracking and data-driven insights for
                            emotional well-being
                        </li>


                        <li><i className="bi bi-people"></i> Clinician Dashboard: Monitor patient progress with
                            AI-driven analytics
                        </li>
                        <li><i className="bi bi-lock"></i> Secure and confidential conversations with end-to-end
                            encryption
                        </li>
                    </ul>
                </section>

                {/* Contact Section */}
                <section id="contact" className="landing-section" ref={el => sectionRefs.current[2] = el}>
                    <h2 className="display-4">Contact Us</h2>
                    <p>
                        Have questions or need help? Reach out to our team at:
                        <br />
                        <a href="mailto:support@emotichat.com">support@emotichat.com</a>
                    </p>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default Landing;