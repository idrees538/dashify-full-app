import {
    IoChevronBackOutline,
    IoChevronForwardOutline,
    IoSyncOutline,
} from 'react-icons/io5';
import { EVENT_TYPES } from '../constants';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarHeader({ currentDate, goToPrev, goToNext, goToToday, loading }) {
    const month = MONTH_NAMES[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            {/* Left: Navigation */}
            <div className="flex items-center gap-3">
                <button
                    onClick={goToToday}
                    className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider
                     rounded-lg border border-border-color bg-bg-secondary
                     text-text-primary hover:bg-bg-hover transition-colors shadow-sm"
                >
                    Today
                </button>

                <button
                    onClick={goToPrev}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                     border border-border-color bg-bg-secondary
                     text-text-secondary hover:bg-bg-hover transition-colors shadow-sm"
                >
                    <IoChevronBackOutline />
                </button>

                <button
                    onClick={goToNext}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                     border border-border-color bg-bg-secondary
                     text-text-secondary hover:bg-bg-hover transition-colors shadow-sm"
                >
                    <IoChevronForwardOutline />
                </button>

                <h2 className="text-lg font-bold text-text-primary ml-1 whitespace-nowrap">
                    {month} {year}
                </h2>

                {loading && (
                    <IoSyncOutline className="animate-spin text-text-secondary text-base ml-1" />
                )}
            </div>

            {/* Right: Legend */}
            <div className="flex items-center gap-3">
                {Object.entries(EVENT_TYPES).map(([key, t]) => (
                    <span
                        key={key}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                         ${t.bg} ${t.text} border ${t.border}`}
                    >
                        <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                        {t.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
