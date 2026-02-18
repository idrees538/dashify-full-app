import { IoChatbubbleOutline, IoSendOutline } from 'react-icons/io5';
import { useState } from 'react';

function Chat() {
    const [message, setMessage] = useState('');
    const conversations = [
        {
            id: 1, name: 'Design Team', lastMsg: 'Updated the mockups!', time: '2m ago', unread: 3,
            messages: [
                { from: 'Sarah', text: 'Hey, the new mockups are ready for review.', time: '10:30 AM', self: false },
                { from: 'You', text: 'Great, I will check them out!', time: '10:32 AM', self: true },
                { from: 'Sarah', text: 'Updated the mockups!', time: '10:35 AM', self: false },
            ],
        },
    ];

    return (
        <div className="page">
            <div className="page__header">
                <h1 className="page__title">Chat</h1>
                <p className="page__subtitle">Stay connected with your team.</p>
            </div>

            <div style={{
                display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24,
                background: 'var(--bg-card)', borderRadius: 16, overflow: 'hidden',
                border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', minHeight: 500
            }}>
                {/* Conversation List */}
                <div style={{ borderRight: '1px solid var(--border-color)', padding: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Messages</h3>
                    {conversations.map((conv) => (
                        <div key={conv.id} style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px',
                            borderRadius: 10, background: 'var(--sidebar-active-bg)', cursor: 'pointer', marginBottom: 4
                        }}>
                            <div style={{
                                width: 40, height: 40, minWidth: 40, borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgb(255, 96, 55), rgb(255, 96, 55))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 500, fontSize: 14
                            }}>DT</div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 14 }}>{conv.name}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMsg}</div>
                            </div>
                            {conv.unread > 0 && (
                                <span style={{
                                    minWidth: 20, height: 20, borderRadius: 10, background: 'rgb(255, 96, 55)',
                                    color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>{conv.unread}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Chat Area */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: 16 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
                        {conversations[0].messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: msg.self ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    maxWidth: '70%', padding: '10px 14px', borderRadius: 12,
                                    background: msg.self ? 'rgb(255, 96, 55)' : 'var(--bg-hover)',
                                    color: msg.self ? '#fff' : 'var(--text-primary)',
                                }}>
                                    {!msg.self && <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'rgb(255, 96, 55)' }}>{msg.from}</div>}
                                    <p style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.text}</p>
                                    <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7, textAlign: 'right' }}>{msg.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: 8,
                        background: 'var(--bg-hover)', borderRadius: 12
                    }}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            style={{
                                flex: 1, padding: '10px 14px', border: 'none', background: 'transparent',
                                outline: 'none', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Roboto, sans-serif'
                            }}
                        />
                        <button style={{
                            width: 36, height: 36, borderRadius: '50%', background: 'rgb(255, 96, 55)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16
                        }}>
                            <IoSendOutline />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
