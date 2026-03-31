import React, { useEffect, useState } from 'react';
import BusinessSidebar from '../../components/BusinessSidebar';

const Settings = () => {
    const [businessName, setBusinessName] = useState(() => {
        return localStorage.getItem('seasphere_business_name') || '';
    });
    const [saved, setSaved] = useState(false);

    const [notifications, setNotifications] = useState(() => {
        const s = localStorage.getItem('seasphere_business_settings_notifications');
        try { return s ? JSON.parse(s) : { email: false, push: false, activity: false }; }
        catch { return { email: false, push: false, activity: false }; }
    });

    useEffect(() => {
        localStorage.setItem('seasphere_business_settings_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const handleSaveName = () => {
        localStorage.setItem('seasphere_business_name', businessName);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="dashboard-container">
            <BusinessSidebar />
            <main className="main-content">
                <h1 className="page-title-mb">Settings</h1>

                <div
                    className="glass-card fade-in"
                    style={{
                        marginBottom: '20px',
                        minHeight: '130px',
                        borderRadius: '20px',
                        backgroundImage: "linear-gradient(120deg, rgba(2, 132, 199, 0.82), rgba(14, 116, 144, 0.72)), url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '24px',
                    }}
                >
                    <div>
                        <h2 style={{ color: '#ffffff', marginBottom: '8px' }}>Workspace Settings</h2>
                        <p style={{ color: 'rgba(255,255,255,0.88)', margin: 0 }}>Manage your business name and notification preferences.</p>
                    </div>
                </div>

                <div className="settings-container glass-card fade-in">
                    {/* Business Name Section */}
                    <section>
                        <h3 className="settings-section-title">Business Name</h3>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px' }}>
                            <input
                                type="text"
                                placeholder="Enter your business name"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#f8fafc',
                                    fontSize: '15px',
                                    color: 'var(--text-dark)',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={handleSaveName}
                                className="btn btn-primary"
                                style={{ whiteSpace: 'nowrap', padding: '12px 24px' }}
                            >
                                {saved ? <><i className="fa-solid fa-check"></i> Saved!</> : 'Save Name'}
                            </button>
                        </div>
                        {saved && (
                            <p style={{ color: 'var(--success-color)', fontSize: '13px', marginTop: '8px' }}>
                                <i className="fa-solid fa-circle-check"></i> Business name updated successfully.
                            </p>
                        )}
                    </section>

                    {/* Notifications Section */}
                    <section style={{ marginTop: '40px' }}>
                        <h3 className="settings-section-title">Notifications</h3>
                        <SettingRow
                            title="Email Notifications"
                            desc="Receive daily summaries and alerts via email."
                            active={notifications.email}
                            onToggle={() => setNotifications((prev) => ({ ...prev, email: !prev.email }))}
                        />
                        <SettingRow
                            title="Push Notifications"
                            desc="Direct alerts in your browser."
                            active={notifications.push}
                            onToggle={() => setNotifications((prev) => ({ ...prev, push: !prev.push }))}
                        />
                        <SettingRow
                            title="Team Activity"
                            desc="Notifications for team-wide updates."
                            active={notifications.activity}
                            onToggle={() => setNotifications((prev) => ({ ...prev, activity: !prev.activity }))}
                        />
                    </section>

                    {/* Danger Zone */}
                    <section className="danger-zone">
                        <h3 className="danger-title">Danger Zone</h3>
                        <p className="text-muted-sm mb-12">Once you delete your account, there is no going back. Please be certain.</p>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                                    localStorage.clear();
                                    window.location.href = '/';
                                }
                            }}
                        >
                            Delete Account
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
};

const SettingRow = ({ title, desc, active, onToggle }) => (
    <div className="settings-row" onClick={onToggle} style={{ cursor: 'pointer' }}>
        <div>
            <div className="setting-title">{title}</div>
            <div className="setting-desc">{desc}</div>
        </div>
        <div className={`toggle-switch ${active ? 'toggle-on' : 'toggle-off'}`}>
            <div className={`toggle-handle ${active ? 'handle-right' : 'handle-left'}`}></div>
        </div>
    </div>
);

export default Settings;
