import React, { useState, useEffect } from 'react';
import BusinessSidebar from '../../components/BusinessSidebar';
import RightSidebar from '../../components/RightSidebar';
import { supabase } from '../../lib/supabase';

const BusinessTeams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', lead: '', description: '' });

    useEffect(() => { loadTeams(); }, []);

    async function loadTeams() {
        setLoading(true);
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .eq('category', 'business')
            .order('created_at', { ascending: false });
        if (!error) setTeams(data || []);
        setLoading(false);
    }

    async function handleCreateTeam(e) {
        e.preventDefault();
        const { error } = await supabase.from('teams').insert([{
            name: newTeam.name,
            lead: newTeam.lead,
            description: newTeam.description,
            members: 1,
            status: 'Active',
            category: 'business',
            type: 'Private'
        }]);
        if (!error) {
            setShowModal(false);
            setNewTeam({ name: '', lead: '', description: '' });
            loadTeams();
        } else {
            console.error("Error creating team:", error);
            alert("Failed to create team: " + error.message);
        }
    }

    async function handleDeleteTeam(id) {
        const { error } = await supabase.from('teams').delete().eq('id', id);
        if (!error) loadTeams();
    }

    return (
        <div className="dashboard-container">
            <BusinessSidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Business Teams</h1>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <i className="fa-solid fa-plus"></i> Add New Department
                    </button>
                </div>

                <div
                    className="glass-card fade-in"
                    style={{
                        marginBottom: '20px',
                        minHeight: '150px',
                        borderRadius: '20px',
                        backgroundImage: "linear-gradient(120deg, rgba(8, 47, 73, 0.78), rgba(14, 116, 144, 0.72)), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '24px',
                    }}
                >
                    <div>
                        <h2 style={{ color: '#ffffff', marginBottom: '8px' }}>Build your team structure</h2>
                        <p style={{ color: 'rgba(255,255,255,0.86)', margin: 0 }}>No starter departments are pre-filled. Add your own teams and leads here.</p>
                    </div>
                </div>

                <div className="table-responsive glass-card fade-in">
                    <table className="custom-table">
                        <thead className="table-header-row">
                            <tr>
                                <th className="table-th">Department</th>
                                <th className="table-th">Lead</th>
                                <th className="table-th">Members</th>
                                <th className="table-th">Status</th>
                                <th className="table-th-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    <i className="fa-solid fa-spinner fa-spin"></i> Loading...
                                </td></tr>
                            ) : teams.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
                                        alt="Empty team workspace"
                                        style={{ width: '100%', maxWidth: '260px', borderRadius: '14px', marginBottom: '12px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                                    />
                                    No departments yet. Click "Add New Department" to create your first one.
                                </td></tr>
                            ) : (
                                teams.map(team => (
                                    <tr key={team.id} className="table-row">
                                        <td className="table-td"><div className="fw-600">{team.name}</div></td>
                                        <td className="table-td">{team.lead || '—'}</td>
                                        <td className="table-td">{team.members || 1} Members</td>
                                        <td className="table-td">
                                            <span className={`status-badge ${team.status === 'Active' ? 'status-active' : 'status-away'}`}>
                                                {team.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="table-td-right">
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Manage</button>
                                                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem', color: '#ff6b6b', borderColor: '#ff6b6b' }} onClick={() => handleDeleteTeam(team.id)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add Department Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)'
                    }}>
                        <div className="glass-card" style={{ width: '450px', padding: '30px', borderRadius: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h2 style={{ fontSize: '1.3rem', color: 'var(--text-color)' }}>
                                    <i className="fa-solid fa-building" style={{ color: 'var(--accent-color)', marginRight: '10px' }}></i>
                                    Add New Department
                                </h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <form onSubmit={handleCreateTeam}>
                                <div style={{ marginBottom: '18px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Department Name</label>
                                    <input type="text" required value={newTeam.name} onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none' }}
                                        placeholder="Department name" />
                                </div>
                                <div style={{ marginBottom: '18px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Team Lead</label>
                                    <input type="text" value={newTeam.lead} onChange={(e) => setNewTeam({...newTeam, lead: e.target.value})}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none' }}
                                        placeholder="Lead name" />
                                </div>
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Description</label>
                                    <textarea value={newTeam.description} onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-color)', fontSize: '0.95rem', outline: 'none',
                                        minHeight: '80px', resize: 'vertical' }}
                                        placeholder="Department responsibilities..." />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Department</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <RightSidebar />
        </div>
    );
};

export default BusinessTeams;
