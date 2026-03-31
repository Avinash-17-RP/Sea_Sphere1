import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [stats, setStats] = useState(() => {
        const saved = localStorage.getItem('seasphere_landing_stats');
        if (!saved) return [];
        try { return JSON.parse(saved); } catch { return []; }
    });
    const [newStat, setNewStat] = useState({ label: '', value: '', accent: '#06b6d4' });

    useEffect(() => {
        localStorage.setItem('seasphere_landing_stats', JSON.stringify(stats));
    }, [stats]);

    const addStat = (e) => {
        e.preventDefault();
        if (!newStat.label.trim() || !newStat.value.trim()) return;
        setStats((prev) => [{ id: Date.now(), ...newStat, label: newStat.label.trim(), value: newStat.value.trim() }, ...prev]);
        setNewStat({ label: '', value: '', accent: '#06b6d4' });
    };

    const removeStat = (id) => setStats((prev) => prev.filter((s) => s.id !== id));

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className="landing-hero fade-in">
                <div className="hero-background">
                    <div className="hero-blob hero-blob-1"></div>
                    <div className="hero-blob hero-blob-2"></div>
                </div>
                <div className="glass-card hero-content">
                    <div className="logo logo-large">
                        <i className="fa-solid fa-layer-group logo-icon-light"></i> SeaSphere
                    </div>

                    <h1 className="hero-title">The Future of Collaboration</h1>
                    <p className="hero-subtext">Unite your team, streamline your projects, and achieve more together with
                        SeaSphere's powerful workspace.</p>

                    <div className="hero-buttons">
                        <Link to="/signin" className="btn btn-primary">
                            Get Started <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                        <Link to="/signup" className="btn btn-outline">
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Why Choose SeaSphere?</h2>
                        <p>Powerful tools designed for modern teams</p>
                    </div>
                    <div className="features-grid">
                        <FeatureCard 
                            icon="fa-users" 
                            title="Team Collaboration" 
                            description="Work seamlessly with your team in real-time. Share ideas, files, and progress all in one place." 
                            iconClass="feature-icon-users"
                        />
                        <FeatureCard 
                            icon="fa-chart-line" 
                            title="Project Management" 
                            description="Track projects from start to finish with intuitive dashboards and detailed analytics." 
                            iconClass="feature-icon-chart"
                        />
                        <FeatureCard 
                            icon="fa-shield-halved" 
                            title="Secure & Reliable" 
                            description="Enterprise-grade security keeps your data safe. Trust us with your team's most important work." 
                            iconClass="feature-icon-shield"
                        />
                        <FeatureCard 
                            icon="fa-bell" 
                            title="Smart Notifications" 
                            description="Stay informed with intelligent alerts. Never miss important updates from your team." 
                            iconClass="feature-icon-bell"
                        />
                        <FeatureCard 
                            icon="fa-mobile" 
                            title="Mobile Ready" 
                            description="Access your workspace anywhere. Manage projects on the go with our mobile-optimized interface." 
                            iconClass="feature-icon-mobile"
                        />
                        <FeatureCard 
                            icon="fa-rocket" 
                            title="Performance" 
                            description="Lightning-fast performance ensures you're always productive. No delays, no compromises." 
                            iconClass="feature-icon-rocket"
                        />
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="showcase-section">
                <div className="section-container">
                    <div className="showcase-content">
                        <div className="showcase-text fade-in">
                            <h2>Collaborate Without Boundaries</h2>
                            <p>SeaSphere brings your team together. Whether you're working on personal projects or managing a
                                large enterprise, our platform scales with your needs.</p>
                            <ul className="showcase-list">
                                <li><i className="fa-solid fa-check"></i> Real-time collaboration</li>
                                <li><i className="fa-solid fa-check"></i> Advanced task management</li>
                                <li><i className="fa-solid fa-check"></i> Integrated communication</li>
                                <li><i className="fa-solid fa-check"></i> Beautiful dashboards</li>
                            </ul>
                        </div>
                        <div className="showcase-image fade-in">
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop"
                                alt="Team collaboration" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="stats-section">
                <div className="section-container">
                    <div className="glass-card" style={{ padding: '18px', marginBottom: '16px' }}>
                        <form onSubmit={addStat} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px auto', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Label (e.g. Clients, Launches)"
                                value={newStat.label}
                                onChange={(e) => setNewStat((prev) => ({ ...prev, label: e.target.value }))}
                            />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Value"
                                value={newStat.value}
                                onChange={(e) => setNewStat((prev) => ({ ...prev, value: e.target.value }))}
                            />
                            <input
                                type="color"
                                className="form-input"
                                style={{ padding: '4px' }}
                                value={newStat.accent}
                                onChange={(e) => setNewStat((prev) => ({ ...prev, accent: e.target.value }))}
                                title="Accent color"
                            />
                            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                                <i className="fa-solid fa-plus"></i> Add Stat
                            </button>
                        </form>
                    </div>

                    {stats.length === 0 ? (
                        <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <img
                                src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80"
                                alt="Set your own highlights"
                                style={{ width: '100%', maxWidth: '320px', borderRadius: '16px', marginBottom: '14px' }}
                            />
                            <h3 style={{ marginBottom: '8px' }}>No highlights yet</h3>
                            <p className="text-muted">Add your own milestones above to showcase what matters.</p>
                        </div>
                    ) : (
                        <div className="stats-grid">
                            {stats.map((item) => (
                                <StatCard key={item.id} number={item.value} label={item.label} accent={item.accent} onRemove={() => removeStat(item.id)} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="section-container">
                    <h2>Ready to Transform Your Workflow?</h2>
                    <p>Join thousands of teams already using SeaSphere</p>
                    <div className="cta-buttons">
                        <Link to="/signup" className="btn btn-primary btn-large">
                            Start Free Trial <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                        <Link to="/signin" className="btn btn-outline btn-large">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

const LandingFooter = () => (
    <footer className="landing-footer">
        <div className="footer-container">
            <div className="footer-grid">
                <div className="footer-info">
                    <div className="logo logo-footer">
                        <i className="fa-solid fa-layer-group"></i> SeaSphere
                    </div>
                    <p>Empowering teams to achieve more through seamless collaboration and intelligent project management.</p>
                    <div className="social-links">
                        <a href="#"><i className="fa-brands fa-twitter"></i></a>
                        <a href="#"><i className="fa-brands fa-linkedin"></i></a>
                        <a href="#"><i className="fa-brands fa-github"></i></a>
                        <a href="#"><i className="fa-brands fa-facebook"></i></a>
                    </div>
                </div>
                <div className="footer-links-column">
                    <h4>Product</h4>
                    <a href="#">Features</a>
                    <a href="#">Solutions</a>
                    <a href="#">Pricing</a>
                    <a href="#">Security</a>
                </div>
                <div className="footer-links-column">
                    <h4>Company</h4>
                    <a href="#">About Us</a>
                    <a href="#">Careers</a>
                    <a href="#">Blog</a>
                    <a href="#">Press</a>
                </div>
                <div className="footer-links-column">
                    <h4>Resources</h4>
                    <a href="#">Documentation</a>
                    <a href="#">Help Center</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; 2026 SeaSphere Inc. All rights reserved. Made with <i className="fa-solid fa-heart text-danger"></i> for teams everywhere.
            </div>
        </div>
    </footer>
);

const FeatureCard = ({ icon, title, description, iconClass }) => (
    <div className="feature-card fade-in">
        <div className={`feature-icon ${iconClass}`}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const StatCard = ({ number, label, accent = '#06b6d4', onRemove }) => (
    <div className="stat-card fade-in" style={{ position: 'relative', borderTop: `4px solid ${accent}` }}>
        <button
            onClick={onRemove}
            aria-label="Remove stat"
            style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
            <i className="fa-solid fa-xmark"></i>
        </button>
        <h3 style={{ color: accent }}>{number}</h3>
        <p>{label}</p>
    </div>
);

export default Home;
