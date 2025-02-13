import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './pages_styles/Register.css';

const Register = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [customPronouns, setCustomPronouns] = useState(''); // State for custom pronouns
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeToEULA, setAgreeToEULA] = useState(false); // Track EULA agreement
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!agreeToEULA) {
            setError("You must agree to the EULA to register.");
            return;
        }

        // Do NOT override pronouns with the custom value.
        // Just keep pronouns in your state as 'other' if user picks other.
        const payload = {
            firstname,
            lastname,
            gender,
            // If user chose "other" in the dropdown, pronouns should be "other"
            // If user chose "he/him", pronouns should be "he/him", etc.
            pronouns,
            // If pronouns is "other", pass customPronouns
            customPronouns: pronouns === 'other' ? customPronouns : undefined,
            username,
            email,
            password,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', payload);
            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
        }
    };


    return (
        <div className="register-page d-flex justify-content-center align-items-center">
            <div className="card register-card p-4">
                <h3 className="text-center mb-4 display-4">Register</h3>
                {/*<p className="card-text text-center text-secondary">Create a new account to get started.</p>*/}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstname" className="form-label">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            className="form-control"
                            placeholder="Enter your first name"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastname" className="form-label">Last Name</label>
                        <input
                            type="text"
                            id="lastname"
                            className="form-control"
                            placeholder="Enter your last name"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select
                            id="gender"
                            className="form-control"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select your gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="nonbinary">Non-binary</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pronouns" className="form-label">Pronouns</label>
                        <select
                            id="pronouns"
                            className="form-control"
                            value={pronouns}
                            onChange={(e) => setPronouns(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select your pronouns</option>
                            <option value="he/him">He/Him</option>
                            <option value="she/her">She/Her</option>
                            <option value="they/them">They/Them</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                    </div>
                    {/* Render custom pronouns field if "Other" is selected */}
                    {pronouns === 'other' && (
                        <div className="mb-3">
                            <label htmlFor="customPronouns" className="form-label">Custom Pronouns</label>
                            <input
                                type="text"
                                id="customPronouns"
                                className="form-control"
                                placeholder="Enter your pronouns"
                                value={customPronouns}
                                onChange={(e) => setCustomPronouns(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* EULA Agreement */}
                    <div className="mb-3 d-flex align-items-center">
                        <input
                            type="checkbox"
                            id="eula"
                            className="form-check-input me-2" // Add margin to separate checkbox and label
                            checked={agreeToEULA}
                            onChange={(e) => setAgreeToEULA(e.target.checked)}
                            required
                        />
                        <label htmlFor="eula" className="form-check-label mb-0">
                            I agree to the <a href="/eula" target="_blank" rel="noopener noreferrer">End-User License
                            Agreement (EULA)</a>.
                        </label>
                    </div>

                    <button type="submit" className="btn btn-dark w-100">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;