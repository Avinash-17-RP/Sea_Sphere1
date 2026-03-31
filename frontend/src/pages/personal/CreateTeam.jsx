import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalSidebar from '../../components/PersonalSidebar';
import RightSidebar from '../../components/RightSidebar';
import { supabase } from '../../lib/supabase';

const CreateTeam = () => {
    const navigate = useNavigate();
    const [team, setTeam] = useState({ name: '', description: '', type: 'Public' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('teams').insert([{
            name: team.name,
            description: team.description,
            type: team.type,
            members: 1,
            category: 'personal'
        }]);
        
        if (!error) {
            navigate('/personal/my-teams');
        } else {
            alert("Error: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="dashboard-container">
            <PersonalSidebar />
            <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '60px' }}>
                <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'rgba(56,189,248,0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '1.5rem' }}>
                            <i className="fa-solid fa-plus"></i>
                        </div>
                        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-color)', marginBottom: '10px' }}>Create New Team</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Start a new collaboration space for your projects.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontSize: '0.9rem' }}>Team Name</label>
                            <input 
                                type="text" required value={team.name} onChange={(e) => setTeam({...team, name: e.target.value})}
                                style={{ width: '100%', padding: '14px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-dark)', fontSize: '1rem', outline: 'none' }}
                                placeholder="Enter team name"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontSize: '0.9rem' }}>Description (Optional)</label>
                            <textarea 
                                value={team.description} onChange={(e) => setTeam({...team, description: e.target.value})}
                                style={{ width: '100%', padding: '14px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', color: 'var(--text-dark)', fontSize: '1rem', outline: 'none', height: '100px', resize: 'none' }}
                                placeholder="What is this team's mission?"
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-light)', fontSize: '0.9rem' }}>Visibility</label>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                {['Public', 'Private'].map(t => (
                                    <div 
                                        key={t} onClick={() => setTeam({...team, type: t})}
                                        style={{ 
                                            flex: 1, padding: '15px', borderRadius: '14px', cursor: 'pointer', textAlign: 'center',
                                            border: team.type === t ? '2px solid var(--accent-color)' : '1px solid #e2e8f0',
                                            background: team.type === t ? 'rgba(56,189,248,0.05)' : '#f8fafc',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <i className={`fa-solid ${t === 'Public' ? 'fa-globe' : 'fa-lock'}`} style={{ display: 'block', marginBottom: '5px', fontSize: '1.2rem', color: team.type === t ? 'var(--accent-color)' : 'var(--text-light)' }}></i>
                                        <span style={{ fontSize: '0.9rem', color: team.type === t ? 'var(--text-dark)' : 'var(--text-light)' }}>{t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button type="button" onClick={() => navigate(-1)} className="btn btn-outline" style={{ flex: 1, padding: '14px' }}>Cancel</button>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>
                                {loading ? 'Creating...' : 'Create Team'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <RightSidebar />
        </div>
    );
};

export default CreateTeam;
