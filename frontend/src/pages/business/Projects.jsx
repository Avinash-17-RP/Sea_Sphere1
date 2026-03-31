import React, { useState, useEffect } from 'react';
import BusinessSidebar from '../../components/BusinessSidebar';
import { supabase } from '../../lib/supabase';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', progress: 0, category: 'Engineering' });

    useEffect(() => { loadProjects(); }, []);

    async function loadProjects() {
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setProjects(data || []);
        setLoading(false);
    }

    async function handleCreateProject(e) {
        e.preventDefault();
        const { error } = await supabase.from('projects').insert([{
            name: newProject.name,
            description: newProject.description,
            category: newProject.category,
            status: 'active'
        }]);
        if (!error) {
            setShowModal(false);
            setNewProject({ name: '', description: '', progress: 0, category: 'Engineering' });
            loadProjects();
        } else {
            alert("Error creating project: " + error.message);
        }
    }

    async function handleDeleteProject(id) {
        if (!window.confirm("Delete this project?")) return;
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (!error) loadProjects();
    }

    const getBadgeClass = (category) => {
        switch(category) {
            case 'Engineering': return 'badge-engineering';
            case 'Design': return 'badge-design';
            case 'Marketing': return 'badge-marketing';
            default: return 'badge-engineering';
        }
    };

    return (
        <div className="dashboard-container">
            <BusinessSidebar />
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Current Projects</h1>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <i className="fa-solid fa-plus"></i> New Project
                    </button>
                </div>

                <div
                    className="glass-card fade-in"
                    style={{
                        marginBottom: '20px',
                        minHeight: '150px',
                        borderRadius: '20px',
                        backgroundImage: "linear-gradient(120deg, rgba(30, 41, 59, 0.8), rgba(3, 105, 161, 0.7)), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '24px',
                    }}
                >
                    <div>
                        <h2 style={{ color: '#ffffff', marginBottom: '8px' }}>Project space powered by your own data</h2>
                        <p style={{ color: 'rgba(255,255,255,0.86)', margin: 0 }}>No random example projects are shown. Add and track your real work items here.</p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                        <i className="fa-solid fa-spinner fa-spin"></i> Loading projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
                        <img
                            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80"
                            alt="Empty projects"
                            style={{ width: '100%', maxWidth: '320px', borderRadius: '16px', marginBottom: '16px' }}
                        />
                        <p style={{ color: 'var(--text-muted)' }}>No projects found. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="grid-layout-auto">
                        {projects.map(project => (
                            <div key={project.id} className="glass-card project-card fade-in">
                                <div className="card-header-flex">
                                    <span className={`category-badge ${getBadgeClass(project.category)}`}>{project.category}</span>
                                    <button 
                                        onClick={() => handleDeleteProject(project.id)}
                                        style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                                <h3 className="mb-5">{project.name}</h3>
                                <p className="card-desc">{project.description}</p>
                                <div className="progress-info">
                                    <span>Progress</span>
                                    <span>{project.progress || 0}%</span>
                                </div>
                                <div className="progress-track mb-20">
                                    <div className="btn-primary progress-fill" style={{ width: `${project.progress || 0}%` }}></div>
                                </div>
                                <div className="card-footer">
                                    <div className="due-date">
                                        <i className="fa-regular fa-calendar"></i> {new Date(project.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="avatar-group">
                                        <div className="user-avatar avatar-xs">
                                            {project.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'PR'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Project Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)'
                    }}>
                        <div className="glass-card" style={{ width: '450px', padding: '30px', borderRadius: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h2 style={{ fontSize: '1.3rem', color: 'var(--text-color)' }}>New Project</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <form onSubmit={handleCreateProject}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Project Name</label>
                                    <input type="text" required value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', background: '#ffffff', color: '#000000' }} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                                    <textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', background: '#ffffff', color: '#000000', height: '80px' }} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
                                    <select value={newProject.category} onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: 'white' }}>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Progress ({newProject.progress}%)</label>
                                    <input type="range" min="0" max="100" value={newProject.progress} onChange={(e) => setNewProject({...newProject, progress: e.target.value})}
                                        style={{ width: '100%', accentColor: 'var(--accent-color)' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Projects;
