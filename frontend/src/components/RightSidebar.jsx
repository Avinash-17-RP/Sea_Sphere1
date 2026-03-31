import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const RightSidebar = () => {
    const { user } = useUser();
    const [now, setNow] = useState(() => new Date());
    const localTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('rightSidebarCollapsed');
        return saved === 'true';
    });
    const [topics, setTopics] = useState(() => {
        const savedTopics = localStorage.getItem('seasphere_trending_topics');
        if (!savedTopics) {
            return [];
        }
        try {
            return JSON.parse(savedTopics);
        } catch {
            return [];
        }
    });
    const [topicInput, setTopicInput] = useState({ tag: '', count: '' });

    useEffect(() => {
        localStorage.setItem('rightSidebarCollapsed', isCollapsed);
    }, [isCollapsed]);

    useEffect(() => {
        localStorage.setItem('seasphere_trending_topics', JSON.stringify(topics));
    }, [topics]);

    const addTopic = (e) => {
        e.preventDefault();
        if (!topicInput.tag.trim()) {
            return;
        }
        const newTopic = {
            id: Date.now(),
            tag: topicInput.tag.trim(),
            count: topicInput.count.trim() || 'Now trending'
        };
        setTopics((prev) => [newTopic, ...prev]);
        setTopicInput({ tag: '', count: '' });
    };

    const removeTopic = (id) => {
        setTopics((prev) => prev.filter((topic) => topic.id !== id));
    };

    return (
        <aside className={`right-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`} style={{ 
            width: isCollapsed ? '80px' : '280px', 
            transition: 'width 0.3s ease', 
            overflowX: 'hidden', 
            height: '100vh', 
            position: 'sticky', 
            top: 0, 
            display: 'flex', 
            flexDirection: 'column' 
        }}>
            <div className="right-header" style={{ 
                display: 'flex', 
                flexDirection: isCollapsed ? 'column' : 'row', 
                justifyContent: isCollapsed ? 'center' : 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px', 
                paddingBottom: '12px', 
                borderBottom: '1px solid var(--nav-border)' 
            }}>
                {!isCollapsed && <h2>Insights</h2>}
                {isCollapsed ? (
                    <button 
                        className="btn-icon maximize-btn" 
                        onClick={() => setIsCollapsed(false)} 
                        style={{ 
                            background: 'rgba(0, 212, 255, 0.15)', 
                            color: '#00d4ff', 
                            width: '45px', 
                            height: '45px', 
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '1px solid #00d4ff',
                            transition: 'all 0.2s ease',
                            fontSize: '1.2rem',
                            marginTop: '10px'
                        }}
                        title="Expand Insights"
                    >
                        <i className="fa-solid fa-angles-left"></i>
                    </button>
                ) : (
                    <button className="btn-icon" onClick={() => setIsCollapsed(true)} style={{ color: '#00d4ff', fontSize: '1.3rem', cursor: 'pointer', border: 'none', background: 'transparent', transition: 'all 0.3s ease', padding: '8px' }} title="Collapse Insights">
                        <i className="fa-solid fa-angles-right"></i>
                    </button>
                )}
            </div>

            {!isCollapsed && (
                <>
                    <div className="mini-clock" style={{ width: '100%', marginBottom: '20px', maxWidth: 'none', margin: '0 0 20px 0' }}>
                        <div className="mini-clock-face">
                            <span className="mini-clock-hour">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="mini-clock-tz">{localTz}</span>
                        </div>
                        <i className="fa-regular fa-clock mini-clock-icon"></i>
                    </div>

                    <form onSubmit={addTopic} className="right-card">
                        <input
                            type="text"
                            className="form-input right-input"
                            placeholder="Topic tag"
                            value={topicInput.tag}
                            onChange={(e) => setTopicInput((prev) => ({ ...prev, tag: e.target.value }))}
                        />
                        <div className="right-input-row">
                            <input
                                type="text"
                                className="form-input right-input"
                                placeholder="Count text"
                                value={topicInput.count}
                                onChange={(e) => setTopicInput((prev) => ({ ...prev, count: e.target.value }))}
                            />
                            <button type="submit" className="btn btn-primary right-add-btn">Add</button>
                        </div>
                    </form>

                    <div className="right-card">
                        <div className="right-card-title">Trending Topics</div>
                        <ul className="trending-list">
                            {topics.length === 0 ? (
                                <li className="right-empty">No topics yet.</li>
                            ) : (
                                topics.map((topic) => (
                                    <li key={topic.id} className="trending-item">
                                        <div>
                                            <Link to="#" className="trending-tag">{topic.tag}</Link>
                                            <span className="trending-count">{topic.count}</span>
                                        </div>
                                        <button className="btn btn-outline right-remove" onClick={() => removeTopic(topic.id)}>X</button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    <div className="right-card">
                        <div className="right-card-title">Quick Links</div>
                        <ul className="right-links">
                            <li><Link to="/personal/planner"><i className="fa-solid fa-pen-nib"></i> Planner</Link></li>
                            <li><Link to="/personal/my-teams"><i className="fa-solid fa-users"></i> Teams</Link></li>
                            <li><Link to="/business/dashboard"><i className="fa-solid fa-briefcase"></i> Business Hub</Link></li>
                        </ul>
                    </div>

                    <div className="right-card profile-card" style={{ marginTop: 'auto' }}>
                        <div className="profile-row">
                            <div className="user-avatar avatar-compact">{user?.avatar || 'U'}</div>
                            <div className="profile-meta">
                                <div className="profile-name">{user?.name || 'User'}</div>
                                <div className="profile-email">{user?.email || ''}</div>
                            </div>
                        </div>
                        <div className="profile-actions">
                            <Link to="/personal/profile" className="profile-link">
                                <i className="fa-solid fa-user"></i> View Profile
                            </Link>
                            <Link to="/" className="profile-link danger">
                                <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </aside>
    );
};

export default RightSidebar;
