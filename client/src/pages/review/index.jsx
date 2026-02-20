import { useState } from 'react';
import DraftSelector from './components/DraftSelector';
import VideoPlayer from './components/VideoPlayer';
import NotesPanel from './components/NotesPanel';

const DRAFTS = [
    {
        id: 1,
        title: 'Brand Campaign — Final Cut',
        version: 3,
        status: 'in-review',
        date: 'Feb 17, 2026',
        duration: '03:45',
        durationSec: 225,
        color: 'purple',
    },
    {
        id: 2,
        title: 'Product Launch Teaser',
        version: 2,
        status: 'draft',
        date: 'Feb 15, 2026',
        duration: '01:52',
        durationSec: 112,
        color: 'blue',
    },
    {
        id: 3,
        title: 'Client Testimonial Reel',
        version: 1,
        status: 'approved',
        date: 'Feb 12, 2026',
        duration: '05:10',
        durationSec: 310,
        color: 'green',
    },
    {
        id: 4,
        title: 'Social Ads — Q1 Batch',
        version: 4,
        status: 'in-review',
        date: 'Feb 18, 2026',
        duration: '02:28',
        durationSec: 148,
        color: 'orange',
    },
];

const INITIAL_NOTES = {
    1: [
        { id: 101, author: 'Sarah K.', text: 'Logo appears too early — can we push to 0:15?', timestamp: 8, date: 'Feb 17' },
        { id: 102, author: 'Mike D.', text: 'Audio transition here is perfect 🎵', timestamp: 45, date: 'Feb 17' },
        { id: 103, author: 'Sarah K.', text: 'Colour grade feels a bit warm — try cooler tones', timestamp: 124, date: 'Feb 18' },
    ],
    2: [
        { id: 201, author: 'Alex R.', text: 'Need a stronger hook in the first 3 seconds', timestamp: 2, date: 'Feb 15' },
    ],
    3: [
        { id: 301, author: 'Client', text: 'Approved — ready to publish!', timestamp: 0, date: 'Feb 12' },
    ],
    4: [],
};

function Review() {
    const [selectedDraftId, setSelectedDraftId] = useState(DRAFTS[0].id);
    const [allNotes, setAllNotes] = useState(INITIAL_NOTES);
    const [currentTime, setCurrentTime] = useState(84);
    const [highlightedTimestamp, setHighlightedTimestamp] = useState(null);

    const selectedDraft = DRAFTS.find((d) => d.id === selectedDraftId);
    const notes = allNotes[selectedDraftId] || [];

    /* Compute note counts per draft for the badge */
    const noteCounts = DRAFTS.reduce((acc, d) => {
        acc[d.id] = (allNotes[d.id] || []).length;
        return acc;
    }, {});

    const handleAddNote = (note) => {
        setAllNotes((prev) => ({
            ...prev,
            [selectedDraftId]: [...(prev[selectedDraftId] || []), note],
        }));
    };

    const handleSelectDraft = (id) => {
        setSelectedDraftId(id);
        setCurrentTime(0);
        setHighlightedTimestamp(null);
    };

    const handleMarkerClick = (timestamp) => {
        setHighlightedTimestamp(timestamp);
        setCurrentTime(timestamp);
        /* Clear highlight after a few seconds for UX */
        setTimeout(() => setHighlightedTimestamp(null), 4000);
    };

    return (
        <div className="max-w-[1200px] mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-[26px] font-bold text-text-primary mb-2">Review</h1>
                <p className="text-[15px] text-text-secondary font-normal">
                    Select a draft and add timestamped notes for your team.
                </p>
            </div>

            <DraftSelector
                drafts={DRAFTS}
                selectedId={selectedDraftId}
                onSelect={handleSelectDraft}
                noteCounts={noteCounts}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
                <VideoPlayer
                    draft={selectedDraft}
                    currentTime={currentTime}
                    onTimeChange={setCurrentTime}
                    notes={notes}
                    onMarkerClick={handleMarkerClick}
                />
                <NotesPanel
                    notes={notes}
                    currentTime={currentTime}
                    onAddNote={handleAddNote}
                    highlightedTimestamp={highlightedTimestamp}
                />
            </div>
        </div>
    );
}

export default Review;
