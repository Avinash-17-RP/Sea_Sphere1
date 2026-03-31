import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase, GOOGLE_CLIENT_ID } from '../lib/supabase';

const SignUp = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useUser();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        // Save user information
        setUserInfo({
            name: formData.fullName,
            email: formData.email
        });
        navigate('/signin');
    };

    const handleBack = () => {
        navigate('/signin');
    };

    const handleGoogleSignUp = async () => {
        localStorage.setItem('oauth_account_type', 'personal');

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/personal/dashboard`,
                queryParams: {
                    client_id: GOOGLE_CLIENT_ID
                }
            }
        });

        if (error) {
            localStorage.removeItem('oauth_account_type');
            alert(error.message || 'Google signup failed. Please try again.');
        }
    };

    return (
        <div className="auth-container bg-auth-signup">
            <div className="auth-card fade-in">
                <div className="auth-left auth-overlay-signup bg-image-signup">
                    <div className="logo auth-logo">
                        <i className="fa-solid fa-layer-group"></i> SeaSphere
                    </div>
                    <h2 className="auth-welcome-title">Join Us!</h2>
                    <p>Start your journey towards better productivity and teamwork today.</p>
                </div>

                <div className="auth-right">
                    <h2 className="auth-form-title">Create Account</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder=" " 
                                required 
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            />
                            <label className="form-label">Full Name</label>
                        </div>

                        <div className="form-group">
                            <input 
                                type="email" 
                                className="form-input" 
                                placeholder=" " 
                                required 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            <label className="form-label">Email Address</label>
                        </div>

                        <div className="form-group">
                            <input 
                                type="password" 
                                className="form-input" 
                                placeholder=" " 
                                required 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <label className="form-label">Password</label>
                        </div>

                        <div className="form-group">
                            <input 
                                type="password" 
                                className="form-input" 
                                placeholder=" " 
                                required 
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                            <label className="form-label">Confirm Password</label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mb-20">
                            Create Account
                        </button>

                        <div className="auth-divider">
                            <div className="auth-divider-line"></div>
                            <span className="auth-divider-text">Or continue with</span>
                            <div className="auth-divider-line"></div>
                        </div>

                        <button type="button" className="btn-google" onClick={handleGoogleSignUp}>
                            <i className="fa-brands fa-google text-danger"></i> Sign up with Google
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Already have an account? <Link to="/signin" className="auth-link-bold">Sign In</Link>
                    </p>
                    <div className="auth-back-link">
                        <button type="button" onClick={handleBack}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
