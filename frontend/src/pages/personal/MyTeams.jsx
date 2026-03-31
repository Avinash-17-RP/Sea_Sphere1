import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PersonalSidebar from '../../components/PersonalSidebar';
import RightSidebar from '../../components/RightSidebar';
import { supabase } from '../../lib/supabase';

const MyTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadTeams(); }, []);

    async function loadTeams() {
        setLoading(true);
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .eq('category', 'personal')
            .order('created_at', { ascending: false });
        if (!error) setTeams(data || []);
        setLoading(false);
    }

    async function handleDeleteTeam(id) {
        const { error } = await supabase.from('teams').delete().eq('id', id);
        if (!error) loadTeams();
    }

    const colors = ['bg-gradient-primary', 'bg-warning', 'bg-success', 'bg-info'];

    return (
        <div className="dashboard-container">
            <PersonalSidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">My Teams</h1>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/personal/join-team" className="btn btn-outline" style={{ border: '1px solid var(--accent-color)', color: 'var(--text-color)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i> Join Team
                        </Link>
                        <Link to="/personal/create-team" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Create New Team
                        </Link>
                    </div>
                </div>

                <div
                    className="glass-card fade-in"
                    style={{
                        marginBottom: '20px',
                        minHeight: '150px',
                        borderRadius: '20px',
                        backgroundImage: "linear-gradient(120deg, rgba(15, 23, 42, 0.78), rgba(8, 145, 178, 0.72)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '24px',
                    }}
                >
                    <div>
                        <h2 style={{ color: '#ffffff', marginBottom: '8px' }}>Your team hub starts empty</h2>
                        <p style={{ color: 'rgba(255,255,255,0.86)', margin: 0 }}>Create or join teams to fill this page with your own collaboration spaces.</p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '15px', display: 'block' }}></i>
                        Loading teams...
                    </div>
                ) : teams.length === 0 ? (
                    <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '60px 30px' }}>
                        <img
                            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
                            alt="Team collaboration"
                            style={{ width: '100%', maxWidth: '300px', borderRadius: '16px', marginBottom: '18px' }}
                        />
                        <h3 style={{ marginBottom: '10px', color: 'var(--text-color)' }}>No teams yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Create your first team or join an existing one to get started!</p>
                        <Link to="/personal/create-team" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                            <i className="fa-solid fa-plus"></i> Create Your First Team
                        </Link>
                    </div>
                ) : (
                    <div className="grid-layout-auto">
                        {teams.map((team, idx) => (
                            <div key={team.id} className="glass-card team-card fade-in">
                                <div className={`team-card-border-top ${colors[idx % colors.length]}`}></div>
                                <div className="team-header">
                                    <h3 className="team-title">{team.name}</h3>
                                    <span className={`team-badge ${team.type === 'Public' ? 'badge-public' : 'badge-private'}`}>{team.type}</span>
                                </div>
                                <p className="team-desc">{team.description || 'No description'}</p>
                                <div className="team-footer">
                                    <div className="team-members">
                                        <i className="fa-solid fa-users"></i> {team.members || 1} Members
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>View</button>
                                        <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', color: '#ff6b6b', borderColor: '#ff6b6b' }} onClick={() => handleDeleteTeam(team.id)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <RightSidebar />
        </div>
    );
};

export default MyTeams;
