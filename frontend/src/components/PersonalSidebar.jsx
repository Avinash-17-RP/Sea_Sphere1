import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PersonalSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('leftSidebarCollapsed');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('leftSidebarCollapsed', isCollapsed);
    }, [isCollapsed]);

    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ width: isCollapsed ? '80px' : '260px', transition: 'width 0.3s ease', overflowX: 'hidden', height: '100vh', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="sidebar-header" style={{ display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', justifyContent: isCollapsed ? 'center' : 'space-between', alignItems: 'center', padding: isCollapsed ? '20px 0 0 0' : '10px 10px 0 20px', flexShrink: 0 }}>
                <Link to="/signin" className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                    <i className="fa-solid fa-layer-group" style={{ color: 'var(--accent-color)' }}></i> 
                    {!isCollapsed && "SeaSphere"}
                </Link>
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
                            marginTop: '20px',
                            transition: 'all 0.2s ease',
                            fontSize: '1.2rem'
                        }}
                        title="Maximize Sidebar"
                    >
                        <i className="fa-solid fa-angles-right"></i>
                    </button>
                ) : (
                    <button className="btn-icon" onClick={() => setIsCollapsed(true)} style={{ color: '#00d4ff', fontSize: '1.3rem', cursor: 'pointer', border: 'none', background: 'transparent', transition: 'all 0.3s ease', padding: '8px' }} title="Collapse Sidebar">
                        <i className="fa-solid fa-angles-left"></i>
                    </button>
                )}
            </div>

            <nav className="nav-links" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Link to="/personal/dashboard" className={`nav-item ${isActive('/personal/dashboard') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px', flexShrink: 0 }}>
                    <i className="fa-solid fa-house" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Home"}
                </Link>
                <Link to="/personal/home" className={`nav-item ${isActive('/personal/home') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px', flexShrink: 0 }}>
                    <i className="fa-solid fa-bolt" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Updates"}
                </Link>
                <Link to="/personal/my-teams" className={`nav-item ${isActive('/personal/my-teams') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px', flexShrink: 0 }}>
                    <i className="fa-solid fa-users" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "My Teams"}
                </Link>
                <Link to="/personal/work-progress" className={`nav-item ${isActive('/personal/work-progress') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px', flexShrink: 0 }}>
                    <i className="fa-solid fa-chart-line" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Work Progress"}
                </Link>
                <Link to="/personal/work-management" className={`nav-item ${isActive('/personal/work-management') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px', flexShrink: 0 }}>
                    <i className="fa-solid fa-list-check" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Work Management"}
                </Link>
                <Link to="/personal/planner" className={`nav-item ${isActive('/personal/planner') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px', flexShrink: 0 }}>
                    <i className="fa-solid fa-pen-nib" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Planner"}
                </Link>
                <Link to="/personal/explore" className={`nav-item ${isActive('/personal/explore') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px', flexShrink: 0 }}>
                    <i className="fa-regular fa-compass" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Explore"}
                </Link>
                <Link to="/personal/profile" className={`nav-item ${isActive('/personal/profile') ? 'active' : ''}`} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '15px 0' : '12px 30px', flexShrink: 0 }}>
                    <i className="fa-solid fa-user" style={{ marginRight: isCollapsed ? '0' : '15px' }}></i> {!isCollapsed && "Profile"}
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
                            navigate('/personal/dashboard');
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

            {/* Bottom Section Removed - Moved to Right Sidebar */}
        </aside>
    );
};

export default PersonalSidebar;
