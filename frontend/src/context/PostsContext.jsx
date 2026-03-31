import React, { createContext, useState, useContext, useEffect } from 'react';

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
    const [posts, setPosts] = useState(() => {
        const savedPosts = localStorage.getItem('seasphere_posts');
        if (!savedPosts) {
            return [];
        }
        try {
            return JSON.parse(savedPosts);
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('seasphere_posts', JSON.stringify(posts));
    }, [posts]);

    const addPost = (content, author = 'User', avatar = 'U', role = 'Member', visibility = 'public', mediaItems = []) => {
        const newPost = {
            id: posts.length + 1,
            author: author,
            avatar: avatar,
            role: role,
            time: "Just now",
            content: content,
            media: mediaItems,
            visibility: visibility,
            likes: 0,
            comments: 0
        };
        setPosts([newPost, ...posts]);
    };

    return (
        <PostsContext.Provider value={{ posts, addPost }}>
            {children}
        </PostsContext.Provider>
    );
};

export const usePosts = () => useContext(PostsContext);
