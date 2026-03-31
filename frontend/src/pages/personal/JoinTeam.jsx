import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalSidebar from '../../components/PersonalSidebar';
import RightSidebar from '../../components/RightSidebar';

const JoinTeam = () => {
    const navigate = useNavigate();
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const entry = {
            id: Date.now(),
            code: inviteCode.trim(),
            requestedAt: new Date().toISOString(),
        };
        try {
            const saved = localStorage.getItem('seasphere_join_requests');
            const list = saved ? JSON.parse(saved) : [];
            localStorage.setItem('seasphere_join_requests', JSON.stringify([entry, ...list]));
            setMessage('Join request saved. A team admin can approve you.');
            setInviteCode('');
            setTimeout(() => navigate('/personal/my-teams'), 600);
        } catch (err) {
            console.error(err);
            setMessage('Could not save your request locally. Please retry.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <PersonalSidebar />
            <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '60px' }}>
                <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'rgba(56,189,248,0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.5rem' }}>
                            <i className="fa-solid fa-right-to-bracket"></i>
                        </div>
                        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-color)', marginBottom: '10px' }}>Join a Team</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Enter an invite code to join an existing workspace.</p>
                        {message && <p style={{ color: 'var(--accent-color)', marginTop: '8px' }}>{message}</p>}
                    </div>

                    <form onSubmit={handleJoin}>
                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontSize: '0.9rem' }}>Invite Code</label>
                            <input 
                                type="text" required value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}
                                style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-dark)', fontSize: '1.1rem', outline: 'none', textAlign: 'center', letterSpacing: '2px', fontWeight: '600' }}
                                placeholder="Enter invite code"
                            />
                        </div>

                        <div className="glass-card" style={{ padding: '15px', marginBottom: '30px', background: 'rgba(255,255,255,0.02)', border: '1px dashed #cbd5e1' }}>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>
                                <i className="fa-solid fa-circle-info" style={{ marginRight: '8px', color: 'var(--accent-color)' }}></i>
                                Invite codes are provided by team administrators.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline" style={{ flex: 1, padding: '14px' }}>Cancel</button>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>
                                {loading ? 'Joining...' : 'Join Team'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <RightSidebar />
        </div>
    );
};

export default JoinTeam;
