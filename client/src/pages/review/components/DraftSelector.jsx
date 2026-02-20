import { IoDocumentTextOutline, IoCheckmarkCircle, IoTimeOutline, IoCreateOutline, IoChatbubbleOutline } from 'react-icons/io5';

const STATUS_CONFIG = {
    draft: { label: 'Draft', className: 'review-draft__status--draft', icon: IoCreateOutline },
    'in-review': { label: 'In Review', className: 'review-draft__status--in-review', icon: IoTimeOutline },
    approved: { label: 'Approved', className: 'review-draft__status--approved', icon: IoCheckmarkCircle },
};

function DraftSelector({ drafts, selectedId, onSelect, noteCounts = {} }) {
    return (
        <div className="mb-6">
            <h3 className="text-[13px] font-semibold text-text-secondary uppercase tracking-wider mb-3">Select Draft</h3>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-border-color">
                {drafts.map((draft) => {
                    const isActive = draft.id === selectedId;
                    const cfg = STATUS_CONFIG[draft.status];
                    const StatusIcon = cfg.icon;
                    const noteCount = noteCounts[draft.id] || 0;
                    return (
                        <button
                            key={draft.id}
                            className={`flex items-center gap-3 min-w-[260px] p-[14px] px-[18px] bg-bg-secondary border rounded-xl cursor-pointer transition-all duration-200 text-left hover:border-accent hover:shadow-sm ${isActive ? 'border-accent bg-accent-light shadow-[0_0_0_2px_var(--accent-light)]' : 'border-border-color'}`}
                            onClick={() => onSelect(draft.id)}
                        >
                            <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${isActive ? 'bg-accent text-white' : 'bg-bg-hover text-accent'}`}>
                                <IoDocumentTextOutline />
                                {/* Note count badge */}
                                {noteCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF6037] text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-sm">
                                        {noteCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                <span className="text-sm font-semibold text-text-primary truncate">{draft.title}</span>
                                <span className="text-[12px] text-text-secondary flex items-center gap-1.5">
                                    v{draft.version} · {draft.date}
                                    {noteCount > 0 && (
                                        <span className="inline-flex items-center gap-0.5 text-accent">
                                            <IoChatbubbleOutline className="text-[10px]" /> {noteCount}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap flex-shrink-0 ${draft.status === 'draft' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : draft.status === 'in-review' ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 'bg-[#10b981]/10 text-[#10b981]'}`}>
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
