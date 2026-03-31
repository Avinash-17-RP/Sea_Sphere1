import React, { useState, useEffect } from 'react';
import PersonalSidebar from '../../components/PersonalSidebar';
import RightSidebar from '../../components/RightSidebar';
import WorldClocksWidget from '../../components/WorldClocksWidget';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../context/UserContext';

const PersonalDashboard = () => {
    const { user } = useUser();
    const [stats, setStats] = useState({ projects: 0, tasks: 0, hours: 0, teams: 0 });
    const [loading, setLoading] = useState(true);
    const [updates, setUpdates] = useState(() => {
        const savedUpdates = localStorage.getItem('seasphere_personal_updates');
        if (!savedUpdates) {
            return [];
        }
        try {
            return JSON.parse(savedUpdates);
        } catch {
            return [];
        }
    });
    const [newUpdate, setNewUpdate] = useState({ title: '', desc: '', visibility: 'public' });
    const [hoursInput, setHoursInput] = useState(() => localStorage.getItem('seasphere_focus_hours') || '0');
    const userName = user?.name || 'User';

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        localStorage.setItem('seasphere_personal_updates', JSON.stringify(updates));
    }, [updates]);

    async function loadStats() {
        setLoading(true);
        try {
            const [projectsRes, tasksRes, teamsRes] = await Promise.all([
                supabase.from('projects').select('*', { count: 'exact', head: true }),
                supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('category', 'personal'),
                supabase.from('teams').select('*', { count: 'exact', head: true }).eq('category', 'personal')
            ]);

            setStats({
                projects: projectsRes.count || 0,
                tasks: tasksRes.count || 0,
                hours: Number(localStorage.getItem('seasphere_focus_hours') || 0),
                teams: teamsRes.count || 0
            });
        } catch (error) {
            console.error("Error loading stats:", error);
        } finally {
            setLoading(false);
        }
    }

    const addUpdate = (e) => {
        e.preventDefault();
        if (!newUpdate.title.trim() || !newUpdate.desc.trim()) {
            return;
        }
        setUpdates((prev) => [
            {
                id: Date.now(),
                title: newUpdate.title.trim(),
                desc: newUpdate.desc.trim(),
                visibility: newUpdate.visibility,
                time: 'Just now',
                icon: getVisibilityIcon(newUpdate.visibility)
            },
            ...prev,
        ]);
        setNewUpdate({ title: '', desc: '', visibility: 'public' });
    };

    const getVisibilityIcon = (v) => {
        switch (v) {
            case 'team': return 'fa-users';
            case 'friends': return 'fa-heart';
            default: return 'fa-earth-americas';
        }
    };

    const saveHours = () => {
        const parsedHours = Number(hoursInput);
        const safeHours = Number.isNaN(parsedHours) ? 0 : Math.max(0, parsedHours);
        localStorage.setItem('seasphere_focus_hours', String(safeHours));
        setStats((prev) => ({ ...prev, hours: safeHours }));
    };

    const removeUpdate = (id) => {
        setUpdates((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="dashboard-container">
            <PersonalSidebar />

            <main className="main-content">
                <h1 className="page-title-mb">Welcome, {userName}! 👋</h1>

                <div className="glass-card fade-in" style={{ padding: '24px', marginBottom: '20px' }}>
                    <form onSubmit={addUpdate} className="update-form-enhanced">
                        <div className="form-row">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Update title"
                                required
                                value={newUpdate.title}
                                onChange={(e) => setNewUpdate((prev) => ({ ...prev, title: e.target.value }))}
                            />
                            <select 
                                className="form-input visibility-select"
                                value={newUpdate.visibility}
                                onChange={(e) => setNewUpdate((prev) => ({ ...prev, visibility: e.target.value }))}
                            >
                                <option value="public">🌍 Public</option>
                                <option value="team">👥 Team Only</option>
                                <option value="friends">💖 Close Friends</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1 }}
                                placeholder="Update description"
                                required
                                value={newUpdate.desc}
                                onChange={(e) => setNewUpdate((prev) => ({ ...prev, desc: e.target.value }))}
                            />
                            <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add Update</button>
                        </div>
                    </form>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="number"
                            className="form-input"
                            style={{ maxWidth: '220px' }}
                            min="0"
                            placeholder="Focus hours"
                            value={hoursInput}
                            onChange={(e) => setHoursInput(e.target.value)}
                        />
                        <button type="button" className="btn btn-outline" onClick={saveHours}>Save Hours</button>
                    </div>
                </div>

                <div className="dashboard-widgets-grid">
                    {/* Dynamic Analog Clocks Widget */}
                    <WorldClocksWidget gridColumn="span 2" />

                    {/* Updates Widget */}
                    <div className="glass-card updates-widget fade-in">
                        <div className="widget-header">
                            <i className="fa-solid fa-bolt"></i> Recent Updates
                        </div>
                        <div className="updates-list">
                            {updates.length === 0 ? (
                                <p className="text-muted-sm">No updates yet. Add one above.</p>
                            ) : (
                                updates.map((item) => (
                                    <UpdateItem key={item.id} title={item.title} desc={item.desc} time={item.time} icon={item.icon} visibility={item.visibility} onRemove={() => removeUpdate(item.id)} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Widget */}
                    <div className="glass-card stats-mini-grid fade-in">
                        <StatBox label="Projects" value={loading ? "..." : stats.projects} icon="fa-diagram-project" color="blue" />
                        <StatBox label="Tasks" value={loading ? "..." : stats.tasks} icon="fa-list-check" color="green" />
                        <StatBox label="Hours" value={stats.hours} icon="fa-stopwatch" color="orange" />
                        <StatBox label="Teams" value={loading ? "..." : stats.teams} icon="fa-users" color="purple" />
                    </div>
                </div>

                <div className="glass-card welcome-banner fade-in" style={{ marginTop: '30px' }}>
                    <div className="banner-content">
                        <h2>Welcome back!</h2>
                        <p>You have {stats.tasks} tasks to review today. Keep pushing!</p>
                        <button className="btn btn-primary" style={{ marginTop: '15px' }}>View My Tasks</button>
                    </div>
                </div>
            </main>

            <RightSidebar />
        </div>
    );
};

const UpdateItem = ({ title, desc, time, icon, visibility, onRemove }) => (
    <div className="update-item-mini">
        <div className="update-icon-sm">
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div className="update-info" style={{ flex: 1 }}>
            <div className="update-header-sm">
                <div className="update-title-sm">{title}</div>
                <span className={`visibility-badge-mini badge-${visibility || 'public'}`}>
                    {visibility === 'team' ? 'Team' : visibility === 'friends' ? 'Friends' : 'Public'}
                </span>
            </div>
            <div className="update-desc-sm">{desc}</div>
            <div className="update-time-sm">{time}</div>
        </div>
        <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '3px 8px', borderColor: 'rgba(0,0,0,0.1)' }} onClick={onRemove}>
            <i className="fa-solid fa-trash-can" style={{ fontSize: '0.7rem' }}></i>
        </button>
    </div>
);

const StatBox = ({ label, value, icon, color }) => (
    <div className="stat-box">
        <div className={`stat-icon-sm icon-bg-${color}`}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div className="stat-value-sm">{value}</div>
        <div className="stat-label-sm">{label}</div>
    </div>
);

export default PersonalDashboard;
