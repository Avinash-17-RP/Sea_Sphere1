import React, { useState } from 'react';
import PersonalSidebar from '../../components/PersonalSidebar';
import RightSidebar from '../../components/RightSidebar';
import { usePosts } from '../../context/PostsContext';
import { useUser } from '../../context/UserContext';

const PersonalHome = () => {
    const { posts, addPost } = usePosts();
    const { user } = useUser();
    const [newPostContent, setNewPostContent] = useState('');
    const [visibility, setVisibility] = useState('public');

    const userName = user?.name || 'User';
    const userAvatar = user?.avatar || 'U';

    const handlePostSubmit = () => {
        if (newPostContent.trim()) {
            addPost(newPostContent, userName, userAvatar, 'Member', visibility);
            setNewPostContent('');
            setVisibility('public');
        }
    };

    return (
        <div className="dashboard-container">
            <PersonalSidebar />

            {/* Main Content */}
            <main className="main-content">
                <header className="content-header">
                    <h1 className="welcome-text">Updates Feed</h1>
                    <div className="header-actions">
                        <button className="btn-icon"><i className="fa-regular fa-bell"></i></button>
                        <button className="btn-icon"><i className="fa-regular fa-comment"></i></button>
                    </div>
                </header>

                <div className="feed-container">
                    {/* Create Post */}
                    <div className="glass-card post-create-card fade-in">
                        <div className="d-flex-gap-15">
                            <div className="user-avatar">{userAvatar}</div>
                            <textarea 
                                className="post-input" 
                                placeholder={`What's on your mind, ${userName}?`}
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="post-actions-row">
                            <div className="post-media-options">
                                <button className="btn-media"><i className="fa-solid fa-image"></i> Media</button>
                                <select 
                                    className="visibility-dropdown-mini"
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                >
                                    <option value="public">🌍 Public</option>
                                    <option value="teams">👥 Teams</option>
                                    <option value="friends">💖 Friends</option>
                                </select>
                            </div>
                            <button className="btn btn-primary" onClick={handlePostSubmit}>Post Update</button>
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="posts-feed">
                        {posts.map(post => (
                            <PostCard key={post.id} {...post} />
                        ))}
                    </div>
                </div>
            </main>

            {/* Right Sidebar */}
            <RightSidebar />
        </div>
    );
};

const PostCard = ({ author, avatar, role, time, content, likes, comments, visibility }) => (
    <div className="glass-card post-card fade-in">
        <div className="post-header">
            <div className="user-avatar">{avatar}</div>
            <div className="flex-1">
                <div className="fw-600 d-flex-center-gap-10">
                    {author}
                    <span className={`visibility-badge-v2 badge-${visibility || 'public'}`}>
                        {visibility === 'teams' ? 'Teams' : visibility === 'friends' ? 'Friends' : 'Public'}
                    </span>
                </div>
                <div className="text-muted-sm">{role} • {time}</div>
            </div>
            <button className="btn-icon-sm"><i className="fa-solid fa-ellipsis"></i></button>
        </div>
        <div className="post-content">
            {content}
        </div>
        <div className="post-footer">
            <button className="btn-post-action"><i className="fa-regular fa-heart"></i> {likes}</button>
            <button className="btn-post-action"><i className="fa-regular fa-comment"></i> {comments}</button>
            <button className="btn-post-action"><i className="fa-solid fa-share"></i></button>
        </div>
    </div>
);

export default PersonalHome;
