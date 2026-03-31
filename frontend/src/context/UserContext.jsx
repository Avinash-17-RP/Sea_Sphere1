import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const mapAuthUserToAppUser = (authUser) => {
        if (!authUser) {
            return null;
        }

        const savedAccountType = localStorage.getItem('oauth_account_type') || 'personal';
        const fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email || 'User';

        return {
            name: fullName,
            email: authUser.email || '',
            accountType: savedAccountType,
            avatar: fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
            location: '',
            about: '',
            teams: 0,
            projects: 0,
            followers: 0
        };
    };

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('usuario');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        const syncSessionUser = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!error && data.session?.user) {
                setUser(mapAuthUserToAppUser(data.session.user));
            }
        };

        syncSessionUser();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(mapAuthUserToAppUser(session.user));
                localStorage.removeItem('oauth_account_type');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('usuario', JSON.stringify(user));
        } else {
            localStorage.removeItem('usuario');
        }
    }, [user]);

    const setUserInfo = (userData) => {
        const userObj = {
            name: userData.name || 'User',
            email: userData.email || '',
            accountType: userData.accountType || 'personal',
            avatar: (userData.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            location: userData.location || '',
            about: userData.about || '',
            teams: userData.teams || 0,
            projects: userData.projects || 0,
            followers: userData.followers || 0
        };
        setUser(userObj);
    };

    const updateUserProfile = (profileData) => {
        setUser(prevUser => ({
            ...prevUser,
            location: profileData.location || prevUser?.location || '',
            about: profileData.about || prevUser?.about || '',
            teams: profileData.teams || prevUser?.teams || 0,
            projects: profileData.projects || prevUser?.projects || 0,
            followers: profileData.followers || prevUser?.followers || 0
        }));
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUserInfo, updateUserProfile, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};
