import { useState } from 'react';
import { IoPlayOutline, IoExpandOutline, IoVolumeHighOutline } from 'react-icons/io5';

function VideoPlayer({ draft, currentTime, onTimeChange, notes = [], onMarkerClick }) {
    const [hoveredMarker, setHoveredMarker] = useState(null);
    const progressPercent = draft ? (currentTime / draft.durationSec) * 100 : 0;

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    /* Group notes that share the same timestamp (±2s) into clusters */
    const markerClusters = notes.reduce((acc, note) => {
        const existing = acc.find((c) => Math.abs(c.timestamp - note.timestamp) <= 2);
        if (existing) {
            existing.count += 1;
            existing.ids.push(note.id);
        } else {
            acc.push({ timestamp: note.timestamp, count: 1, ids: [note.id] });
        }
        return acc;
    }, []);

    if (!draft) {
        return (
            <div className="overflow-hidden p-0 bg-bg-secondary rounded-xl shadow-sm border border-border-color">
                <div className="w-full aspect-video flex flex-col items-center justify-center text-text-secondary text-3xl gap-3">
                    <IoPlayOutline />
                    <p className="text-sm">Select a draft to begin reviewing</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden p-0 bg-bg-secondary rounded-xl shadow-sm border border-border-color">
            {/* Simulated video area */}
            <div className={`relative w-full aspect-video flex items-center justify-center overflow-hidden
                ${draft.color === 'purple' ? 'bg-gradient-to-br from-[#FF6037]/25 via-accent/20 to-black/60' :
                    draft.color === 'blue' ? 'bg-gradient-to-br from-blue-500/30 via-blue-600/15 to-black/60' :
                        draft.color === 'green' ? 'bg-gradient-to-br from-[#10B981]/25 via-[#34D399]/15 to-black/60' :
                            'bg-gradient-to-br from-[#F59E0B]/30 via-[#FBBF24]/15 to-black/60'}`}>
                <button className="w-[72px] h-[72px] rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-[32px] text-white transition-all duration-200 border-2 border-white/20 hover:scale-[1.08] hover:bg-white/25">
                    <IoPlayOutline />
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="bg-black/60 text-white px-3 py-1 rounded-md text-[12px] font-semibold">{draft.title}</span>
                    <span className="bg-accent text-white px-2.5 py-1 rounded-md text-[11px] font-bold">v{draft.version}</span>
                </div>
            </div>

            {/* Controls bar */}
            <div className="flex items-center gap-3 p-[14px] px-[18px] bg-bg-secondary border-t border-border-color">
                <button className="w-8 h-8 flex items-center justify-center text-text-secondary rounded-md text-lg transition-colors hover:text-text-primary">
                    <IoPlayOutline />
                </button>
                <span className="text-[12px] font-semibold text-text-secondary font-mono whitespace-nowrap">
                    {formatTime(currentTime)} / {draft.duration}
                </span>

                {/* Timeline with annotation markers */}
                <div
                    className="flex-1 cursor-pointer py-1.5 relative"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = (e.clientX - rect.left) / rect.width;
                        onTimeChange(Math.round(pct * draft.durationSec));
                    }}
                >
                    <div className="relative w-full h-[5px] bg-bg-hover rounded-full">
                        {/* Progress fill */}
                        <div
                            className="absolute top-0 left-0 h-full bg-accent rounded-full transition-all duration-150"
                            style={{ width: `${progressPercent}%` }}
                        />
                        {/* Playhead */}
                        <div
                            className="absolute top-1/2 w-3.5 h-3.5 bg-accent border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm transition-all duration-150 z-[3]"
                            style={{ left: `${progressPercent}%` }}
                        />
                    </div>

                    {/* Annotation markers */}
                    {markerClusters.map((cluster) => {
                        const pct = (cluster.timestamp / draft.durationSec) * 100;
                        const isHovered = hoveredMarker === cluster.timestamp;
                        return (
                            <div
                                key={cluster.timestamp}
                                className="absolute top-1/2 -translate-y-1/2 z-[5] group"
                                style={{ left: `${pct}%` }}
                                onMouseEnter={() => setHoveredMarker(cluster.timestamp)}
                                onMouseLeave={() => setHoveredMarker(null)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTimeChange(cluster.timestamp);
                                    onMarkerClick?.(cluster.timestamp);
                                }}
                            >
                                {/* Marker dot */}
                                <div className={`w-3 h-3 rounded-full -translate-x-1/2 cursor-pointer transition-all duration-200 border-2 border-white shadow-md
                                    ${isHovered ? 'bg-[#FF6037] scale-150' : 'bg-[#FF6037]/80 scale-100'}
                                `} />

                                {/* Tooltip on hover */}
                                {isHovered && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#1a1a2e] text-white text-[10px] font-semibold rounded-md whitespace-nowrap shadow-lg border border-white/10 pointer-events-none animate-fade-in">
                                        {formatTime(cluster.timestamp)}
                                        {cluster.count > 1 && (
                                            <span className="ml-1 px-1.5 py-0.5 bg-accent rounded-full text-[9px]">{cluster.count}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button className="w-8 h-8 flex items-center justify-center text-text-secondary rounded-md text-lg transition-colors hover:text-text-primary">
                    <IoVolumeHighOutline />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-text-secondary rounded-md text-lg transition-colors hover:text-text-primary">
                    <IoExpandOutline />
                </button>
            </div>
        </div>
    );
}

export default VideoPlayer;
