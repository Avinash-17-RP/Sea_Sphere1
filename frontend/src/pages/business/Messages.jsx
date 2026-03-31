import React, { useMemo, useState, useEffect } from 'react';
import BusinessSidebar from '../../components/BusinessSidebar';

const Messages = () => {
    const [chats, setChats] = useState(() => {
        const savedChats = localStorage.getItem('seasphere_chats');
        if (!savedChats) {
            return [];
        }
        try {
            return JSON.parse(savedChats);
        } catch {
            return [];
        }
    });
    const [activeChatId, setActiveChatId] = useState(null);
    const [newChatName, setNewChatName] = useState('');
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        localStorage.setItem('seasphere_chats', JSON.stringify(chats));
    }, [chats]);

    const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) || null, [chats, activeChatId]);

    const createChat = (e) => {
        e.preventDefault();
        if (!newChatName.trim()) {
            return;
        }
        const chat = {
            id: Date.now(),
            name: newChatName.trim(),
            messages: [],
            updatedAt: 'Just now',
        };
        setChats((prev) => [chat, ...prev]);
        setActiveChatId(chat.id);
        setNewChatName('');
    };

    const sendMessage = () => {
        if (!activeChat || !messageInput.trim()) {
            return;
        }
        const message = {
            id: Date.now(),
            text: messageInput.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChats((prev) => prev.map((chat) => (
            chat.id === activeChat.id
                ? { ...chat, messages: [...chat.messages, message], updatedAt: 'Just now' }
                : chat
        )));
        setMessageInput('');
    };

    const deleteChat = (id) => {
        setChats((prev) => prev.filter((chat) => chat.id !== id));
        if (activeChatId === id) {
            setActiveChatId(null);
        }
    };

    return (
        <div className="dashboard-container">
            <BusinessSidebar />

            <main className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <h1 className="page-title-mb">Messages</h1>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '1400px', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', overflow: 'hidden', minHeight: '600px', border: '1px solid #e2e8f0' }}>
                    
                    {/* Left Sidebar (Chats List) */}
                    <aside style={{ width: '350px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
                        <form onSubmit={createChat} style={{ padding: '20px' }}>
                            <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={newChatName}
                                    onChange={(e) => setNewChatName(e.target.value)}
                                    placeholder="New chat name..."
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', color: '#334155', background: '#f8fafc' }}
                                />
                                <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Add</button>
                            </div>
                        </form>

                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {chats.length === 0 ? (
                                <div style={{ padding: '20px', color: '#94a3b8', fontSize: '14px' }}>No chats yet. Create one above.</div>
                            ) : (
                                chats.map((chat) => (
                                    <ChatItem
                                        key={chat.id}
                                        name={chat.name}
                                        preview={chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'No messages yet'}
                                        time={chat.updatedAt}
                                        active={activeChatId === chat.id}
                                        onClick={() => setActiveChatId(chat.id)}
                                        onDelete={() => deleteChat(chat.id)}
                                    />
                                ))
                            )}
                        </div>
                    </aside>

                    {/* Right Main (Active Chat) */}
                    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                        {/* Chat Header */}
                        <header style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                                    {activeChat ? activeChat.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() : '--'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>{activeChat ? activeChat.name : 'No chat selected'}</div>
                                    <div style={{ color: '#10b981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                                        Active
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '16px' }}>
                                <i className="fa-solid fa-phone" style={{ cursor: 'pointer' }}></i>
                                <i className="fa-solid fa-video" style={{ cursor: 'pointer' }}></i>
                                <i className="fa-solid fa-circle-info" style={{ cursor: 'pointer' }}></i>
                            </div>
                        </header>

                        {/* Chat Messages */}
                        <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {activeChat ? (
                                activeChat.messages.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', margin: '10px 0' }}>No messages yet. Send the first message.</div>
                                ) : (
                                    activeChat.messages.map((message) => (
                                        <Message key={message.id} text={message.text} time={message.time} />
                                    ))
                                )
                            ) : (
                                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', margin: '10px 0' }}>Select or create a chat to start messaging.</div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div style={{ padding: '20px 30px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>
                                <i className="fa-solid fa-paperclip"></i>
                            </button>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                style={{ flex: 1, padding: '14px 20px', borderRadius: '24px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', background: '#f8fafc' }}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />
                            <button
                                style={{ background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={sendMessage}
                                disabled={!activeChat}
                            >
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </main>

                </div>
                </div>
            </main>
        </div>
    );
};

const ChatItem = ({ name, preview, time, active, onClick, onDelete }) => (
    <div style={{ 
        padding: '15px 20px', display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer',
        background: active ? '#f1f5f9' : 'transparent',
        borderLeft: active ? '3px solid #0ea5e9' : '3px solid transparent',
        transition: 'background 0.2s'
    }} onClick={onClick}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 }}>
            {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{name}</span>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>{time}</span>
            </div>
            <div style={{ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {preview}
            </div>
        </div>
        <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '3px 6px' }} onClick={(e) => { e.stopPropagation(); onDelete(); }}>X</button>
    </div>
);

const Message = ({ text, time }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '75%', alignSelf: 'flex-end' }}>
            <div style={{ 
                background: '#06b6d4',
                color: '#ffffff',
                padding: '14px 20px', 
                borderRadius: '8px',
                borderBottomRightRadius: '0',
                borderBottomLeftRadius: '8px',
                boxShadow: '0 4px 10px rgba(6, 182, 212, 0.2)',
                border: 'none',
                fontSize: '15px',
                lineHeight: '1.5'
            }}>
                {text}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>{time}</div>
        </div>
    );
};

export default Messages;
