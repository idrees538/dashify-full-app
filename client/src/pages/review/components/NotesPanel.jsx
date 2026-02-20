import { useState, useRef, useEffect } from 'react';
import {
    IoSendOutline,
    IoTimeOutline,
    IoPersonCircleOutline,
    IoAddOutline,
    IoChatbubbleOutline,
    IoCheckmarkCircleOutline,
} from 'react-icons/io5';

function NoteItem({ note, isHighlighted, noteRef }) {
    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return (
        <div
            ref={noteRef}
            className={`relative flex gap-3 p-3.5 rounded-xl transition-all duration-300 border
                ${isHighlighted
                    ? 'bg-accent/8 border-accent/40 shadow-[0_0_12px_var(--accent-light)]'
                    : 'bg-transparent border-transparent hover:bg-bg-hover'
                }`}
        >
            {/* Accent left bar */}
            <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-all duration-300
                ${isHighlighted ? 'bg-accent' : 'bg-transparent'}`}
            />

            <div className="text-[30px] text-text-secondary flex-shrink-0 leading-none">
                <IoPersonCircleOutline />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-text-primary">{note.author}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono
                        ${isHighlighted
                            ? 'bg-accent text-white'
                            : 'bg-accent-light text-accent'
                        }`}>
                        <IoTimeOutline /> {formatTime(note.timestamp)}
                    </span>
                </div>
                <p className="text-[13px] text-text-primary leading-relaxed mb-2">{note.text}</p>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-text-secondary">{note.date}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                        <button className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] text-text-secondary hover:text-accent hover:bg-accent-light transition-colors">
                            <IoChatbubbleOutline /> Reply
                        </button>
                        <button className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] text-text-secondary hover:text-[#10b981] hover:bg-[#10b981]/10 transition-colors">
                            <IoCheckmarkCircleOutline /> Resolve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotesPanel({ notes, currentTime, onAddNote, highlightedTimestamp }) {
    const [newNote, setNewNote] = useState('');
    const noteRefs = useRef({});
    const listRef = useRef(null);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    /* Auto-scroll to highlighted note */
    useEffect(() => {
        if (highlightedTimestamp == null) return;
        const matchingNote = notes.find((n) => Math.abs(n.timestamp - highlightedTimestamp) <= 2);
        if (matchingNote && noteRefs.current[matchingNote.id]) {
            noteRefs.current[matchingNote.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [highlightedTimestamp, notes]);

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

    const sortedNotes = notes.slice().sort((a, b) => a.timestamp - b.timestamp);

    return (
        <div className="flex flex-col max-h-[520px] bg-bg-secondary rounded-xl p-[18px] shadow-sm border border-border-color">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-color mb-4">
                <h3 className="text-[17px] font-semibold text-text-primary flex items-center gap-2">
                    <IoChatbubbleOutline className="text-accent" />
                    Notes
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-accent-light text-accent text-[12px] font-bold">
                        {notes.length}
                    </span>
                </h3>
                <span className="text-[11px] text-text-secondary font-medium">Frame.io</span>
            </div>

            {/* Note input */}
            <form className="flex flex-col gap-2 mb-4" onSubmit={handleSubmit}>
                <div className="inline-flex items-center gap-1 self-start px-2.5 py-1 rounded-md bg-accent-light text-accent text-[12px] font-semibold font-mono">
                    <IoTimeOutline /> {formatTime(currentTime)}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-border-color bg-bg-primary text-text-primary text-[13px] transition-colors focus:outline-none focus:border-accent placeholder:text-text-secondary/60"
                        placeholder="Add a note at this timestamp…"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center text-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:scale-[1.05] flex-shrink-0"
                        disabled={!newNote.trim()}
                    >
                        <IoSendOutline />
                    </button>
                </div>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-border-color" />
                <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Annotations</span>
                <div className="flex-1 h-px bg-border-color" />
            </div>

            {/* Notes list */}
            <div ref={listRef} className="flex-1 overflow-y-auto flex flex-col gap-1 scrollbar-thin scrollbar-thumb-border-color pr-1">
                {sortedNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 px-5 text-text-secondary text-[28px] gap-3">
                        <IoAddOutline />
                        <p className="text-[13px] text-center">No notes yet. Scrub the timeline and add your first annotation above.</p>
                    </div>
                ) : (
                    sortedNotes.map((note) => (
                        <div key={note.id} className="group/note">
                            <NoteItem
                                note={note}
                                isHighlighted={highlightedTimestamp != null && Math.abs(note.timestamp - highlightedTimestamp) <= 2}
                                noteRef={(el) => { noteRefs.current[note.id] = el; }}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotesPanel;
