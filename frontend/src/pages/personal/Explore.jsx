import React, { useState, useMemo, useEffect } from 'react';
import PersonalSidebar from '../../components/PersonalSidebar';
import RightSidebar from '../../components/RightSidebar';

const Explore = () => {
    const [profiles, setProfiles] = useState(() => {
        const savedProfiles = localStorage.getItem('seasphere_explore_profiles');
        if (!savedProfiles) {
            return [];
        }
        try {
            return JSON.parse(savedProfiles);
        } catch {
            return [];
        }
    });
    const [newProfile, setNewProfile] = useState({ name: '', role: '' });
    const [query, setQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('seasphere_explore_profiles', JSON.stringify(profiles));
    }, [profiles]);

    const filteredProfiles = useMemo(() => {
        if (!query.trim()) {
            return profiles;
        }
        const normalizedQuery = query.toLowerCase();
        return profiles.filter((profile) => (
            profile.name.toLowerCase().includes(normalizedQuery)
            || profile.role.toLowerCase().includes(normalizedQuery)
        ));
    }, [profiles, query]);

    const addProfile = (e) => {
        e.preventDefault();
        if (!newProfile.name.trim() || !newProfile.role.trim()) {
            return;
        }
        setProfiles((prev) => [
            {
                id: Date.now(),
                name: newProfile.name.trim(),
                role: newProfile.role.trim(),
            },
            ...prev,
        ]);
        setNewProfile({ name: '', role: '' });
    };

    const removeProfile = (id) => setProfiles((prev) => prev.filter((profile) => profile.id !== id));

    return (
        <div className="dashboard-container">
            <PersonalSidebar />
            <main className="main-content">
                <form onSubmit={addProfile} className="glass-card fade-in" style={{ padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr auto', gap: '10px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Person name"
                            value={newProfile.name}
                            onChange={(e) => setNewProfile((prev) => ({ ...prev, name: e.target.value }))}
                        />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Role"
                            value={newProfile.role}
                            onChange={(e) => setNewProfile((prev) => ({ ...prev, role: e.target.value }))}
                        />
                        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-plus"></i> Add</button>
                    </div>
                </form>

                <div className="explore-search-container fade-in">
                    <i className="fa-solid fa-magnifying-glass search-icon-left"></i>
                    <input
                        type="text"
                        className="form-input search-input-padding"
                        placeholder="Search for teams, projects, or people..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="explore-tabs fade-in">
                    <div className="tab-item active">Trending</div>
                    <div className="tab-item">Top Teams</div>
                    <div className="tab-item">People</div>
                </div>

                <div className="grid-layout-auto">
                    {filteredProfiles.length === 0 ? (
                        <div className="glass-card user-card-center fade-in" style={{ gridColumn: '1 / -1' }}>
                            <h4>No people yet</h4>
                            <p className="user-role">Add people above to populate Explore.</p>
                        </div>
                    ) : (
                        filteredProfiles.map((profile) => (
                            <UserCard key={profile.id} name={profile.name} role={profile.role} onRemove={() => removeProfile(profile.id)} />
                        ))
                    )}
                </div>
            </main>
            <RightSidebar />
        </div>
    );
};

const UserCard = ({ name, role, onRemove }) => (
    <div className="glass-card user-card-center fade-in">
        <div className="user-avatar-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <h4>{name}</h4>
        <p className="user-role">{role}</p>
        <button className="btn btn-outline btn-full" onClick={onRemove}>Remove</button>
    </div>
);

export default Explore;
