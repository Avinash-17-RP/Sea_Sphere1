import React, { useState } from 'react';
import BusinessSidebar from '../../components/BusinessSidebar';
import { useUser } from '../../context/UserContext';

const BusinessProfile = () => {
    const { user, updateUserProfile } = useUser();
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        location: user?.location || '',
        about: user?.about || '',
        teams: user?.teams || 0,
        projects: user?.projects || 0,
        followers: user?.followers || 0
    });

    const userName = user?.name || 'Business';
    const userAvatar = user?.avatar || 'B';
    const hasProfileData = user?.location || user?.about;

    const handleEditClick = () => {
        setFormData({
            location: user?.location || '',
            about: user?.about || '',
            teams: user?.teams || 0,
            projects: user?.projects || 0,
            followers: user?.followers || 0
        });
        setShowEditModal(true);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateUserProfile(formData);
        setShowEditModal(false);
    };

    return (
        <div className="dashboard-container">
            <BusinessSidebar />
            <main className="main-content" style={{ padding: 0 }}>
                <div className="profile-header-card fade-in">
                    <div className="profile-cover" style={{ background: 'linear-gradient(135deg, #0f2f51 0%, #1a5276 100%)' }}></div>
                    <div className="profile-avatar-container">
                        <div className="profile-avatar-lg bg-warning" style={{ color: 'white' }}>{userAvatar}</div>
                        <div className="profile-info-row">
                            <div>
                                <h1 className="profile-name">{userName}</h1>
                                {user?.location && (
                                    <p className="profile-location"><i className="fa-solid fa-building"></i> {user.location}</p>
                                )}
                            </div>
                            <button className="btn btn-primary" onClick={handleEditClick}>Edit Business Profile</button>
                        </div>
                    </div>
                </div>

                <div className="section-container" style={{ padding: '0 40px 40px' }}>
                    {!hasProfileData ? (
                        <div className="glass-card fade-in" style={{ padding: '60px 30px', textAlign: 'center' }}>
                            <i className="fa-solid fa-building" style={{ fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '20px', display: 'block' }}></i>
                            <h3 style={{ marginBottom: '10px', color: 'var(--text-color)' }}>Complete Your Business Profile</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Add your company location, overview, and metrics to complete your business profile.</p>
                            <button className="btn btn-primary" onClick={handleEditClick}>
                                <i className="fa-solid fa-pencil"></i> Fill in Your Profile
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="stats-grid-3 mb-20">
                                {user?.teams !== undefined && <BusinessStatItem label="Departments" value={user.teams} />}
                                {user?.projects !== undefined && <BusinessStatItem label="Total Projects" value={user.projects} />}
                                {user?.followers !== undefined && <BusinessStatItem label="Active Members" value={user.followers} />}
                            </div>

                            {user?.about && (
                                <div className="glass-card about-section fade-in" style={{ padding: '24px' }}>
                                    <h3 style={{ marginBottom: '15px' }}>Company Overview</h3>
                                    <p className="about-text">{user.about}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Edit Profile Modal */}
                {showEditModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h2 style={{ marginBottom: '30px', color: 'var(--text-dark)' }}>Edit Business Profile</h2>
                            
                            <form onSubmit={handleSaveProfile}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontSize: '0.9rem' }}>Company Location</label>
                                    <input 
                                        type="text" 
                                        value={formData.location} 
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-dark)', fontSize: '1rem', outline: 'none' }}
                                        placeholder="Enter location"
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontSize: '0.9rem' }}>Company Overview</label>
                                    <textarea 
                                        value={formData.about} 
                                        onChange={(e) => setFormData({...formData, about: e.target.value})}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-dark)', fontSize: '1rem', outline: 'none', height: '120px', resize: 'none' }}
                                        placeholder="Tell us about your company..."
                                    />
                                </div>

                                <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontSize: '0.85rem' }}>Departments</label>
                                        <input 
                                            type="number" 
                                            value={formData.teams} 
                                            onChange={(e) => setFormData({...formData, teams: parseInt(e.target.value) || 0})}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-dark)', fontSize: '1rem', outline: 'none' }}
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontSize: '0.85rem' }}>Total Projects</label>
                                        <input 
                                            type="number" 
                                            value={formData.projects} 
                                            onChange={(e) => setFormData({...formData, projects: parseInt(e.target.value) || 0})}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-dark)', fontSize: '1rem', outline: 'none' }}
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontSize: '0.85rem' }}>Active Members</label>
                                        <input 
                                            type="number" 
                                            value={formData.followers} 
                                            onChange={(e) => setFormData({...formData, followers: parseInt(e.target.value) || 0})}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-dark)', fontSize: '1rem', outline: 'none' }}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                                    <button 
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="btn btn-outline"
                                        style={{ flex: 1, padding: '12px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ flex: 1, padding: '12px' }}
                                    >
                                        Save Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const BusinessStatItem = ({ label, value }) => (
    <div className="glass-card stat-card-center fade-in">
        <div className="stat-value-lg">{value}</div>
        <div className="stat-label">{label}</div>
    </div>
);

export default BusinessProfile;
