import React, { useState, useEffect } from 'react';
import BusinessSidebar from '../../components/BusinessSidebar';

const Analytics = () => {
    const [bars, setBars] = useState(() => {
        const savedBars = localStorage.getItem('seasphere_analytics_bars');
        if (!savedBars) {
            return [];
        }
        try {
            return JSON.parse(savedBars);
        } catch {
            return [];
        }
    });
    const [kpis, setKpis] = useState(() => {
        const savedKpis = localStorage.getItem('seasphere_analytics_kpis');
        if (!savedKpis) {
            return { completionRate: 0, roi: 0 };
        }
        try {
            return JSON.parse(savedKpis);
        } catch {
            return { completionRate: 0, roi: 0 };
        }
    });
    const [newBar, setNewBar] = useState({ label: '', value: '' });

    useEffect(() => {
        localStorage.setItem('seasphere_analytics_bars', JSON.stringify(bars));
    }, [bars]);

    useEffect(() => {
        localStorage.setItem('seasphere_analytics_kpis', JSON.stringify(kpis));
    }, [kpis]);

    const addBar = (e) => {
        e.preventDefault();
        const value = Math.max(0, Math.min(100, Number(newBar.value)));
        if (!newBar.label.trim() || Number.isNaN(value)) {
            return;
        }
        setBars((prev) => [...prev, { id: Date.now(), label: newBar.label.trim(), value }]);
        setNewBar({ label: '', value: '' });
    };

    const removeBar = (id) => setBars((prev) => prev.filter((bar) => bar.id !== id));

    return (
        <div className="dashboard-container">
            <BusinessSidebar />
            <main className="main-content">
                <div className="analytics-header">
                    <h1 className="page-title">Analytics Overview</h1>
                    <select className="form-select">
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Yearly</option>
                    </select>
                </div>

                <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '20px' }}>
                    <form onSubmit={addBar} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px', marginBottom: '12px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Bar label"
                            value={newBar.label}
                            onChange={(e) => setNewBar((prev) => ({ ...prev, label: e.target.value }))}
                        />
                        <input
                            type="number"
                            className="form-input"
                            min="0"
                            max="100"
                            placeholder="Value %"
                            value={newBar.value}
                            onChange={(e) => setNewBar((prev) => ({ ...prev, value: e.target.value }))}
                        />
                        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add Bar</button>
                    </form>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                            type="number"
                            className="form-input"
                            min="0"
                            max="100"
                            placeholder="Completion rate %"
                            value={kpis.completionRate}
                            onChange={(e) => setKpis((prev) => ({ ...prev, completionRate: Number(e.target.value) || 0 }))}
                        />
                        <input
                            type="number"
                            className="form-input"
                            placeholder="ROI %"
                            value={kpis.roi}
                            onChange={(e) => setKpis((prev) => ({ ...prev, roi: Number(e.target.value) || 0 }))}
                        />
                    </div>
                </div>

                <div className="chart-grid-2">
                    <div className="glass-card fade-in" style={{ padding: '24px' }}>
                        <h3 className="chart-title">Team Performance</h3>
                        <div className="performance-chart">
                            {bars.length === 0 ? (
                                <p className="text-muted-sm">No performance data yet.</p>
                            ) : (
                                bars.map((bar, index) => (
                                    <ChartBar key={bar.id} id={bar.id} height={`${bar.value * 2}px`} color={index % 2 === 0 ? 'primary' : 'secondary'} label={bar.label} onRemove={removeBar} />
                                ))
                            )}
                        </div>
                    </div>
                    <div className="glass-card fade-in" style={{ padding: '24px' }}>
                        <h3 className="chart-title">Task Completion Rate</h3>
                        <div className="donut-container">
                            <div className="donut-chart">
                                <div className="donut-inner">
                                    <div className="donut-value">{kpis.completionRate}%</div>
                                    <div className="donut-label">Completed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card fade-in" style={{ padding: '24px' }}>
                    <h3>Return on Investment (ROI)</h3>
                    <p className="text-muted" style={{ marginTop: '10px', marginBottom: '20px' }}>ROI is now based on your own input.</p>
                    <div className="metric-value roi-text">{kpis.roi >= 0 ? '+' : ''}{kpis.roi}%</div>
                    <div className={`metric-trend ${kpis.roi >= 0 ? 'trend-up' : 'trend-down'}`}>
                        <i className={`fa-solid ${kpis.roi >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
                        {kpis.roi >= 0 ? ' Trending upward' : ' Trending downward'}
                    </div>
                </div>
            </main>
        </div>
    );
};

const ChartBar = ({ id, height, color, label, onRemove }) => (
    <div className="chart-col">
        <div className={`chart-bar chart-bar-${color}`} style={{ height }}></div>
        <div className="chart-label">{label}</div>
        <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '2px 8px', marginTop: '5px' }} onClick={() => onRemove(id)}>X</button>
    </div>
);

export default Analytics;
