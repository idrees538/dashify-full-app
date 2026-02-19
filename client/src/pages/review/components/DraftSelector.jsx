import { IoDocumentTextOutline, IoCheckmarkCircle, IoTimeOutline, IoCreateOutline } from 'react-icons/io5';

const STATUS_CONFIG = {
    draft: { label: 'Draft', className: 'review-draft__status--draft', icon: IoCreateOutline },
    'in-review': { label: 'In Review', className: 'review-draft__status--in-review', icon: IoTimeOutline },
    approved: { label: 'Approved', className: 'review-draft__status--approved', icon: IoCheckmarkCircle },
};

function DraftSelector({ drafts, selectedId, onSelect }) {
    return (
        <div className="review-drafts">
            <h3 className="review-drafts__label">Select Draft</h3>
            <div className="review-drafts__list">
                {drafts.map((draft) => {
                    const isActive = draft.id === selectedId;
                    const cfg = STATUS_CONFIG[draft.status];
                    const StatusIcon = cfg.icon;
                    return (
                        <button
                            key={draft.id}
                            className={`review-draft ${isActive ? 'review-draft--active' : ''}`}
                            onClick={() => onSelect(draft.id)}
                        >
                            <div className="review-draft__icon">
                                <IoDocumentTextOutline />
                            </div>
                            <div className="review-draft__info">
                                <span className="review-draft__title">{draft.title}</span>
                                <span className="review-draft__meta">
                                    v{draft.version} · {draft.date}
                                </span>
                            </div>
                            <span className={`review-draft__status ${cfg.className}`}>
                                <StatusIcon /> {cfg.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default DraftSelector;
