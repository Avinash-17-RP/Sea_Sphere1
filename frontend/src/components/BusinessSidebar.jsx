import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BusinessSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('businessSidebarCollapsed');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('businessSidebarCollapsed', isCollapsed);
    }, [isCollapsed]);

    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ 
            width: isCollapsed ? '80px' : '260px', 
            transition: 'width 0.3s ease', 
            overflowX: 'hidden', 
            height: '100vh', 
            position: 'sticky', 
            top: 0, 
            display: 'flex', 
            flexDirection: 'column' 
        }}>
            <div className="sidebar-header" style={{ display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', justifyContent: isCollapsed ? 'center' : 'space-between', alignItems: 'center', padding: isCollapsed ? '20px 0 0 0' : '10px 10px 0 20px', flexShrink: 0 }}>
                <Link to="/" className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                    <i className="fa-solid fa-briefcase" style={{ color: 'var(--accent-color)' }}></i> 
                    {!isCollapsed && (
                        <span>SeaSphere <span className="brand-suffix">Biz</span></span>
                    )}
                </Link>
                {isCollapsed ? (
                    <button 
                        className="btn-icon maximize-btn" 
                        onClick={() => setIsCollapsed(false)} 
                        style={{ 
                            background: 'rgba(255,255,255,0.1)', 
                            color: 'white', 
                            width: '45px', 
                            height: '45px', 
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: 'none',
                            marginTop: '20px',
                            transition: 'all 0.2s ease'
                        }}
                        title="Maximize Sidebar"
                    >
                        <i className="fa-solid fa-angles-right"></i>
                    </button>
                ) : (
                    <button className="btn-icon" onClick={() => setIsCollapsed(true)} style={{ color: 'white', fontSize: '1.3rem', cursor: 'pointer', border: 'none', background: 'transparent', transition: 'all 0.3s ease', padding: '8px' }} title="Collapse Sidebar">
                        <i className="fa-solid fa-angles-left"></i>
                    </button>
                )}
            </div>

            <nav className="nav-links" style={{ marginTop: '30px' }}>
                <Link to="/business/dashboard" className={`nav-item ${isActive('/business/dashboard') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px' }}>
                    <i className="fa-solid fa-chart-pie" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Dashboard"}
                </Link>
                <Link to="/business/teams" className={`nav-item ${isActive('/business/teams') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px' }}>
                    <i className="fa-solid fa-people-group" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Teams"}
                </Link>
                <Link to="/business/projects" className={`nav-item ${isActive('/business/projects') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px' }}>
                    <i className="fa-solid fa-diagram-project" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Projects"}
                </Link>
                <Link to="/business/planner" className={`nav-item ${isActive('/business/planner') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px' }}>
                    <i className="fa-solid fa-palette" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Planner"}
                </Link>
                <Link to="/business/messages" className={`nav-item ${isActive('/business/messages') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px' }}>
                    <i className="fa-regular fa-comment-dots" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Messages"}
                </Link>
                <Link to="/business/analytics" className={`nav-item ${isActive('/business/analytics') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px' }}>
                    <i className="fa-solid fa-chart-simple" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Analytics"}
                </Link>
                <Link to="/business/settings" className={`nav-item ${isActive('/business/settings') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px' }}>
                    <i className="fa-solid fa-gear" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Settings"}
                </Link>
            </nav>

            <div className="nav-navigation-actions" style={{ 
                padding: isCollapsed ? '10px 0' : '0 30px', 
                marginTop: 'auto', 
                marginBottom: '20px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '10px' 
            }}>
                <button 
                    onClick={() => {
                        const lastClickTime = sessionStorage.getItem('lastBackClickTime');
                        const now = Date.now();
                        if (lastClickTime && now - parseInt(lastClickTime) < 3000) {
                            sessionStorage.removeItem('lastBackClickTime');
                            navigate('/business/dashboard');
                        } else {
                            sessionStorage.setItem('lastBackClickTime', now.toString());
                            navigate(-1);
                        }
                    }} 
                    className="nav-item-btn" 
                    style={{ 
                        width: isCollapsed ? '45px' : '100%', 
                        height: isCollapsed ? '45px' : 'auto',
                        justifyContent: 'center', 
                        background: 'rgba(255,255,255,0.05)', 
                        border: 'none', 
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: isCollapsed ? '0' : '12px 20px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: isCollapsed ? '0' : '12px',
                        transition: 'all 0.2s ease'
                    }}
                    title="Go Back"
                >
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: isCollapsed ? '18px' : 'inherit' }}></i> 
                    {!isCollapsed && "Back"}
                </button>
            </div>
        </aside>
    );
};

export default BusinessSidebar;
