import React, { useState, useEffect } from 'react';
import BusinessSidebar from '../../components/BusinessSidebar';
import WorldClocksWidget from '../../components/WorldClocksWidget';
import { supabase } from '../../lib/supabase';

const BusinessDashboard = () => {
    const [stats, setStats] = useState({ teams: 0, projects: 0, members: 0, rate: '0%' });
    const [loading, setLoading] = useState(true);
    const [membersInput, setMembersInput] = useState(() => localStorage.getItem('seasphere_business_members') || '0');
    const [rateInput, setRateInput] = useState(() => localStorage.getItem('seasphere_business_rate') || '0');
    const [trends, setTrends] = useState(() => {
        const saved = localStorage.getItem('seasphere_business_trends');
        if (!saved) {
            return { teams: '', projects: '', members: '', rate: '' };
        }
        try {
            return JSON.parse(saved);
        } catch {
            return { teams: '', projects: '', members: '', rate: '' };
        }
    });
    const [updates, setUpdates] = useState(() => {
        const saved = localStorage.getItem('seasphere_business_updates');
        if (!saved) {
            return [];
        }
        try {
            return JSON.parse(saved);
        } catch {
            return [];
        }
    });
    const [activityBars, setActivityBars] = useState(() => {
        const saved = localStorage.getItem('seasphere_business_activity');
        if (!saved) {
            return [];
        }
        try {
            return JSON.parse(saved);
        } catch {
            return [];
        }
    });
    const [newUpdate, setNewUpdate] = useState({ title: '', meta: '' });
    const [newBar, setNewBar] = useState('');

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        localStorage.setItem('seasphere_business_updates', JSON.stringify(updates));
    }, [updates]);

    useEffect(() => {
        localStorage.setItem('seasphere_business_activity', JSON.stringify(activityBars));
    }, [activityBars]);

    useEffect(() => {
        localStorage.setItem('seasphere_business_trends', JSON.stringify(trends));
    }, [trends]);

    async function loadStats() {
        setLoading(true);
        try {
            const [teamsRes, projectsRes] = await Promise.all([
                supabase.from('teams').select('*', { count: 'exact', head: true }).eq('category', 'business'),
                supabase.from('projects').select('*', { count: 'exact', head: true }).eq('category', 'business')
            ]);

            setStats({
                teams: teamsRes.count || 0,
                projects: projectsRes.count || 0,
                members: Number(localStorage.getItem('seasphere_business_members') || 0),
                rate: `${Math.max(0, Math.min(100, Number(localStorage.getItem('seasphere_business_rate') || 0)))}%`
            });
        } catch (error) {
            console.error("Error loading business stats:", error);
        } finally {
            setLoading(false);
        }
    }

    const saveBusinessStats = () => {
        const members = Math.max(0, Number(membersInput) || 0);
        const rate = Math.max(0, Math.min(100, Number(rateInput) || 0));
        localStorage.setItem('seasphere_business_members', String(members));
        localStorage.setItem('seasphere_business_rate', String(rate));
        setStats((prev) => ({ ...prev, members, rate: `${rate}%` }));
    };

    const addUpdate = (e) => {
        e.preventDefault();
        if (!newUpdate.title.trim()) {
            return;
        }
        setUpdates((prev) => [
            {
                id: Date.now(),
                title: newUpdate.title.trim(),
                meta: newUpdate.meta.trim() || 'Just now',
            },
            ...prev,
        ]);
        setNewUpdate({ title: '', meta: '' });
    };

    const addActivityBar = (e) => {
        e.preventDefault();
        const value = Math.max(0, Math.min(100, Number(newBar)));
        if (Number.isNaN(value)) {
            return;
        }
        setActivityBars((prev) => [...prev, { id: Date.now(), height: `${value}%` }]);
        setNewBar('');
    };

    const removeUpdate = (id) => setUpdates((prev) => prev.filter((item) => item.id !== id));
    const removeBar = (id) => setActivityBars((prev) => prev.filter((item) => item.id !== id));

    return (
        <div className="dashboard-container">
            <BusinessSidebar />

            <main className="main-content">
                <h1 className="page-title-mb">Business Overview</h1>

                <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '14px' }}>
                        <input
                            type="number"
                            className="form-input"
                            min="0"
                            placeholder="Team Members"
                            value={membersInput}
                            onChange={(e) => setMembersInput(e.target.value)}
                        />
                        <input
                            type="number"
                            className="form-input"
                            min="0"
                            max="100"
                            placeholder="Completion Rate %"
                            value={rateInput}
                            onChange={(e) => setRateInput(e.target.value)}
                        />
                        <button type="button" className="btn btn-outline" onClick={saveBusinessStats}>Save Stats</button>
                    </div>
                    <form onSubmit={addUpdate} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px', marginBottom: '10px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Recent update title"
                            value={newUpdate.title}
                            onChange={(e) => setNewUpdate((prev) => ({ ...prev, title: e.target.value }))}
                        />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="When (e.g. 2h ago)"
                            value={newUpdate.meta}
                            onChange={(e) => setNewUpdate((prev) => ({ ...prev, meta: e.target.value }))}
                        />
                        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add Update</button>
                    </form>
                    <form onSubmit={addActivityBar} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
                        <input
                            type="number"
                            className="form-input"
                            min="0"
                            max="100"
                            placeholder="Activity bar % height"
                            value={newBar}
                            onChange={(e) => setNewBar(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add Activity</button>
                    </form>
                </div>

                <div className="glass-card fade-in" style={{ padding: '16px', marginBottom: '18px' }}>
                    <h3 style={{ marginBottom: '12px' }}>Trend notes (optional)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input type="text" className="form-input" placeholder="Teams trend"
                            value={trends.teams} onChange={(e) => setTrends((prev) => ({ ...prev, teams: e.target.value }))} />
                        <input type="text" className="form-input" placeholder="Projects trend"
                            value={trends.projects} onChange={(e) => setTrends((prev) => ({ ...prev, projects: e.target.value }))} />
                        <input type="text" className="form-input" placeholder="Members trend"
                            value={trends.members} onChange={(e) => setTrends((prev) => ({ ...prev, members: e.target.value }))} />
                        <input type="text" className="form-input" placeholder="Completion rate trend"
                            value={trends.rate} onChange={(e) => setTrends((prev) => ({ ...prev, rate: e.target.value }))} />
                    </div>
                    <p className="text-muted-sm" style={{ marginTop: '8px' }}>These notes show beneath each KPI and save locally.</p>
                </div>

                <div className="metrics-grid-auto">
                    <MetricCard label="Active Teams" value={loading ? "..." : stats.teams} trend={trends.teams} />
                    <MetricCard label="Active Projects" value={loading ? "..." : stats.projects} trend={trends.projects} />
                    <MetricCard label="Team Members" value={stats.members} trend={trends.members} />
                    <MetricCard label="Completion Rate" value={stats.rate} trend={trends.rate} />
                </div>

                <WorldClocksWidget gridColumn="1 / -1" />

                <div className="dashboard-layout-grid">
                    <div className="glass-card fade-in activity-chart-container" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Team Activity</h3>
                        <div className="activity-bars">
                            {activityBars.length === 0 ? (
                                <p className="text-muted-sm">No activity data yet.</p>
                            ) : (
                                activityBars.map((bar, idx) => (
                                    <ActivityBar key={bar.id} id={bar.id} height={bar.height} accent={idx === activityBars.length - 1} onRemove={removeBar} />
                                ))
                            )}
                        </div>
                        <div className="chart-subtitle">Weekly task completions</div>
                    </div>

                    <div className="glass-card fade-in" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Recent Updates</h3>
                        {updates.length === 0 ? (
                            <p className="text-muted-sm">No updates yet.</p>
                        ) : (
                            updates.map((item) => (
                                <UpdateItem key={item.id} icon="fa-bell" iconBg="icon-bg-blue" title={item.title} meta={item.meta} onRemove={() => removeUpdate(item.id)} />
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

const MetricCard = ({ label, value, trend }) => (
    <div className="glass-card fade-in" style={{ padding: '24px' }}>
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
        <div className="metric-trend">
            {trend ? trend : <span className="text-muted-sm">Add a trend note above</span>}
        </div>
    </div>
);

const ActivityBar = ({ id, height, accent, onRemove }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <div className={`activity-bar ${accent ? 'bg-accent' : 'bg-slate-300'}`} style={{ height }}></div>
        <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '2px 6px' }} onClick={() => onRemove(id)}>X</button>
    </div>
);

const UpdateItem = ({ icon, iconBg, title, meta, onRemove }) => (
    <div className="update-item">
        <div className={`update-icon-circle ${iconBg}`}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
            <div className="update-title">{title}</div>
            <div className="update-meta">{meta}</div>
        </div>
        <button className="btn btn-outline" style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '3px 8px' }} onClick={onRemove}>X</button>
    </div>
);

export default BusinessDashboard;
