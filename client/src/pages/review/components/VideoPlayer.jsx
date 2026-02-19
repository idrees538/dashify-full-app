import { IoPlayOutline, IoExpandOutline, IoVolumeHighOutline } from 'react-icons/io5';

function VideoPlayer({ draft, currentTime, onTimeChange }) {
    const progressPercent = draft ? (currentTime / draft.durationSec) * 100 : 0;

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    if (!draft) {
        return (
            <div className="review-player card">
                <div className="review-player__empty">
                    <IoPlayOutline />
                    <p>Select a draft to begin reviewing</p>
                </div>
            </div>
        );
    }

    return (
        <div className="review-player card">
            {/* Simulated video area */}
            <div className={`review-player__viewport review-player__viewport--${draft.color}`}>
                <button className="review-player__play-btn">
                    <IoPlayOutline />
                </button>
                <div className="review-player__overlay-info">
                    <span className="review-player__draft-label">{draft.title}</span>
                    <span className="review-player__version">v{draft.version}</span>
                </div>
            </div>

            {/* Controls bar */}
            <div className="review-player__controls">
                <button className="review-player__ctrl-btn">
                    <IoPlayOutline />
                </button>
                <span className="review-player__time">
                    {formatTime(currentTime)} / {draft.duration}
                </span>
                <div
                    className="review-player__progress"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = (e.clientX - rect.left) / rect.width;
                        onTimeChange(Math.round(pct * draft.durationSec));
                    }}
                >
                    <div className="review-player__progress-track">
                        <div
                            className="review-player__progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                        <div
                            className="review-player__progress-thumb"
                            style={{ left: `${progressPercent}%` }}
                        />
                    </div>
                </div>
                <button className="review-player__ctrl-btn">
                    <IoVolumeHighOutline />
                </button>
                <button className="review-player__ctrl-btn">
                    <IoExpandOutline />
                </button>
            </div>
        </div>
    );
}

export default VideoPlayer;
