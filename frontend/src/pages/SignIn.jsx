import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase, GOOGLE_CLIENT_ID } from '../lib/supabase';

const SignIn = () => {
    const [accountType, setAccountType] = useState('personal');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUserInfo } = useUser();

    const handleBack = () => {
        navigate('/');
    };

    const handleGoogleSignIn = async () => {
        localStorage.setItem('oauth_account_type', accountType);

        const destination = accountType === 'business' ? '/business/dashboard' : '/personal/dashboard';
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}${destination}`,
                queryParams: {
                    client_id: GOOGLE_CLIENT_ID
                }
            }
        });

        if (error) {
            localStorage.removeItem('oauth_account_type');
            alert(error.message || 'Google login failed. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserInfo({
            name: name || 'User',
            email: email,
            accountType: accountType
        });
        if (accountType === 'personal') {
            navigate('/personal/dashboard');
        } else {
            navigate('/business/dashboard');
        }
    };

    return (
        <div className="auth-container bg-auth-signin">
            <div className="auth-card fade-in">
                <div className="auth-left auth-overlay-signin bg-image-signin">
                    <div className="logo auth-logo">
                        <i className="fa-solid fa-layer-group"></i> SeaSphere
                    </div>
                    <h2 className="auth-welcome-title">Welcome Back!</h2>
                    <p>Sign in to your account and continue collaborating with your team.</p>
                </div>

                <div className="auth-right">
                    <h2 className="auth-form-title">Sign In</h2>

                    <div className="auth-type-selector">
                        <div 
                            className={`type-card ${accountType === 'personal' ? 'active' : ''}`}
                            onClick={() => setAccountType('personal')}
                        >
                            <i className="fa-solid fa-user type-icon"></i>
                            <div>Personal</div>
                        </div>
                        <div 
                            className={`type-card ${accountType === 'business' ? 'active' : ''}`}
                            onClick={() => setAccountType('business')}
                        >
                            <i className="fa-solid fa-briefcase type-icon"></i>
                            <div>Business</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder=" " 
                                required 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label className="form-label">Full Name</label>
                        </div>

                        <div className="form-group">
                            <input 
                                type="email" 
                                className="form-input" 
                                placeholder=" " 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label className="form-label">Email Address</label>
                        </div>

                        <div className="form-group">
                            <input 
                                type="password" 
                                className="form-input" 
                                id="password" 
                                placeholder=" " 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label className="form-label">Password</label>
                            <i className="fa-solid fa-eye password-toggle" id="togglePassword"></i>
                        </div>

                        <a href="#" className="forgot-password-link">Forgot Password?</a>

                        <button type="submit" className="btn btn-primary w-100">
                            Sign In
                        </button>

                        <div className="auth-divider">
                            <div className="auth-divider-line"></div>
                            <span className="auth-divider-text">Or continue with</span>
                            <div className="auth-divider-line"></div>
                        </div>

                        <button type="button" className="btn-google" onClick={handleGoogleSignIn}>
                            <i className="fa-brands fa-google text-danger"></i> Sign in with Google
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Don't have an account? <Link to="/signup" className="auth-link-bold">Sign Up</Link>
                    </p>
                    <div className="auth-back-link">
                        <button type="button" onClick={handleBack}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
