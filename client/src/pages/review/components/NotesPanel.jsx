import { useState } from 'react';
import { IoSendOutline, IoTimeOutline, IoPersonCircleOutline, IoAddOutline } from 'react-icons/io5';

function NoteItem({ note }) {
    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <div className="review-note">
            <div className="review-note__avatar">
                <IoPersonCircleOutline />
            </div>
            <div className="review-note__body">
                <div className="review-note__header">
                    <span className="review-note__author">{note.author}</span>
                    <span className="review-note__timestamp-badge">
                        <IoTimeOutline /> {formatTime(note.timestamp)}
                    </span>
                </div>
                <p className="review-note__text">{note.text}</p>
                <span className="review-note__date">{note.date}</span>
            </div>
        </div>
    );
}

function NotesPanel({ notes, currentTime, onAddNote }) {
    const [newNote, setNewNote] = useState('');

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        onAddNote({
            id: Date.now(),
            author: 'You',
            text: newNote.trim(),
            timestamp: currentTime,
            date: 'Just now',
        });
        setNewNote('');
    };

    return (
        <div className="review-notes card">
            {/* Header */}
            <div className="review-notes__header">
                <h3 className="review-notes__title">
                    Notes
                    <span className="review-notes__count">{notes.length}</span>
                </h3>
            </div>

            {/* Note input */}
            <form className="review-notes__input-area" onSubmit={handleSubmit}>
                <div className="review-notes__timestamp-pill">
                    <IoTimeOutline /> {formatTime(currentTime)}
                </div>
                <div className="review-notes__input-row">
                    <input
                        type="text"
                        className="review-notes__input"
                        placeholder="Add a note at this timestamp…"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button type="submit" className="review-notes__send-btn" disabled={!newNote.trim()}>
                        <IoSendOutline />
                    </button>
                </div>
            </form>

            {/* Notes list */}
            <div className="review-notes__list">
                {notes.length === 0 ? (
                    <div className="review-notes__empty">
                        <IoAddOutline />
                        <p>No notes yet. Add your first annotation above.</p>
                    </div>
                ) : (
                    notes
                        .slice()
                        .sort((a, b) => a.timestamp - b.timestamp)
                        .map((note) => <NoteItem key={note.id} note={note} />)
                )}
            </div>
        </div>
    );
}

export default NotesPanel;
