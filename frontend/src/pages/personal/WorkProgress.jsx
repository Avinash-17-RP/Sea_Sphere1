import React, { useState, useEffect } from 'react';
import PersonalSidebar from '../../components/PersonalSidebar';
import RightSidebar from '../../components/RightSidebar';

const WorkProgress = () => {
    const [metrics, setMetrics] = useState(() => {
        const savedMetrics = localStorage.getItem('seasphere_progress_metrics');
        if (!savedMetrics) {
            return [];
        }
        try {
            return JSON.parse(savedMetrics);
        } catch {
            return [];
        }
    });
    const [goals, setGoals] = useState(() => {
        const savedGoals = localStorage.getItem('seasphere_progress_goals');
        if (!savedGoals) {
            return [];
        }
        try {
            return JSON.parse(savedGoals);
        } catch {
            return [];
        }
    });
    const [metricInput, setMetricInput] = useState({ label: '', value: '' });
    const [goalInput, setGoalInput] = useState({ label: '', percent: '' });

    useEffect(() => {
        localStorage.setItem('seasphere_progress_metrics', JSON.stringify(metrics));
    }, [metrics]);

    useEffect(() => {
        localStorage.setItem('seasphere_progress_goals', JSON.stringify(goals));
    }, [goals]);

    const addMetric = (e) => {
        e.preventDefault();
        if (!metricInput.label.trim()) {
            return;
        }
        setMetrics((prev) => [
            ...prev,
            {
                id: Date.now(),
                label: metricInput.label.trim(),
                value: metricInput.value.trim() || '0',
            },
        ]);
        setMetricInput({ label: '', value: '' });
    };

    const addGoal = (e) => {
        e.preventDefault();
        const numericPercent = Number(goalInput.percent);
        if (!goalInput.label.trim() || Number.isNaN(numericPercent)) {
            return;
        }
        const safePercent = Math.max(0, Math.min(100, numericPercent));
        setGoals((prev) => [
            ...prev,
            {
                id: Date.now(),
                label: goalInput.label.trim(),
                percent: safePercent,
            },
        ]);
        setGoalInput({ label: '', percent: '' });
    };

    const removeMetric = (id) => setMetrics((prev) => prev.filter((item) => item.id !== id));
    const removeGoal = (id) => setGoals((prev) => prev.filter((item) => item.id !== id));

    return (
        <div className="dashboard-container">
            <PersonalSidebar />
            <main className="main-content">
                <h1 className="page-title-mb">Work Progress</h1>

                <div className="glass-card fade-in" style={{ padding: '20px', marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '12px' }}>Add Progress Metric</h3>
                    <form onSubmit={addMetric} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px', marginBottom: '16px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Metric name"
                            value={metricInput.label}
                            onChange={(e) => setMetricInput((prev) => ({ ...prev, label: e.target.value }))}
                        />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Value"
                            value={metricInput.value}
                            onChange={(e) => setMetricInput((prev) => ({ ...prev, value: e.target.value }))}
                        />
                        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add</button>
                    </form>

                    <h3 style={{ marginBottom: '12px' }}>Add Monthly Goal</h3>
                    <form onSubmit={addGoal} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Goal name"
                            value={goalInput.label}
                            onChange={(e) => setGoalInput((prev) => ({ ...prev, label: e.target.value }))}
                        />
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Percent"
                            min="0"
                            max="100"
                            value={goalInput.percent}
                            onChange={(e) => setGoalInput((prev) => ({ ...prev, percent: e.target.value }))}
                        />
                        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add</button>
                    </form>
                </div>

                <div className="progress-grid">
                    {metrics.length === 0 ? (
                        <div className="glass-card progress-metric-card fade-in">
                            <div className="metric-label">No metrics yet. Add your first one above.</div>
                        </div>
                    ) : (
                        metrics.map((metric) => (
                            <ProgressMetric
                                key={metric.id}
                                label={metric.label}
                                value={metric.value}
                                onRemove={() => removeMetric(metric.id)}
                            />
                        ))
                    )}
                </div>

                <div className="glass-card monthly-overview-card fade-in">
                    <h3 style={{ marginBottom: '20px' }}>Monthly Goals</h3>
                    {goals.length === 0 ? (
                        <p className="text-muted-sm">No goals yet. Add your first one above.</p>
                    ) : (
                        goals.map((goal) => (
                            <ProgressBar key={goal.id} label={goal.label} percent={`${goal.percent}%`} onRemove={() => removeGoal(goal.id)} />
                        ))
                    )}
                </div>
            </main>
            <RightSidebar />
        </div>
    );
};

const ProgressMetric = ({ label, value, onRemove }) => (
    <div className="glass-card progress-metric-card fade-in">
        <div>
            <div className="metric-label">{label}</div>
            <div className="metric-value">{value}</div>
        </div>
        <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 10px' }} onClick={onRemove}>Remove</button>
    </div>
);

const ProgressBar = ({ label, percent, onRemove }) => (
    <div className="progress-item">
        <div className="progress-label-row">
            <span className="fw-500">{label}</span>
            <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {percent}
                <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '2px 8px' }} onClick={onRemove}>Remove</button>
            </span>
        </div>
        <div className="progress-bar-bg">
            <div className="btn-primary progress-fill" style={{ width: percent }}></div>
        </div>
    </div>
);

export default WorkProgress;
