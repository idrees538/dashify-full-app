import { IoCalendarOutline } from 'react-icons/io5';

function Schedule() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const events = [
        { time: '09:00', title: 'Team Standup', color: 'rgb(255, 96, 55)' },
        { time: '11:00', title: 'Client Review', color: '#3b82f6' },
        { time: '14:00', title: 'Design Sprint', color: '#10b981' },
        { time: '16:30', title: 'Code Review', color: '#f59e0b' },
    ];

    return (
        <div className="page">
            <div className="page__header">
                <h1 className="page__title">Schedule</h1>
                <p className="page__subtitle">Manage your calendar and upcoming events.</p>
            </div>

            <div className="page__cards">
                {days.map((day) => (
                    <div className="card" key={day} style={{ textAlign: 'center', padding: 16 }}>
                        <p className="card__label">{day}</p>
                        <h2 className="card__value" style={{ fontSize: 20 }}>{Math.floor(Math.random() * 5)}</h2>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>events</span>
                    </div>
                ))}
            </div>

            <div className="table-placeholder">
                <div className="table-placeholder__header">
                    <h3 className="table-placeholder__title">Today's Schedule</h3>
                </div>
                <div className="table-placeholder__rows">
                    {events.map((ev, i) => (
                        <div className="table-placeholder__row" key={i} style={{ alignItems: 'center' }}>
                            <div style={{ minWidth: 60, fontWeight: 500, color: 'var(--text-secondary)', fontSize: 14 }}>{ev.time}</div>
                            <div style={{ width: 4, height: 32, borderRadius: 2, background: ev.color, minWidth: 4 }} />
                            <div style={{ flex: 1, fontWeight: 500, color: 'var(--text-primary)' }}>{ev.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Schedule;
