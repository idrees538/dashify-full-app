import { useState } from 'react';
import useCalendar from './hooks/useCalendar';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import EventModal from './components/EventModal';

export default function CalendarPage() {
    const {
        currentDate,
        grid,
        events,
        todayKey,
        loading,
        goToPrev,
        goToNext,
        goToToday,
        addEvent,
        removeEvent,
    } = useCalendar();

    const [modalCell, setModalCell] = useState(null);

    const handleSave = (dateKey, event) => {
        addEvent(dateKey, event);
        setModalCell(null);
    };

    return (
        <div className="flex flex-col h-full min-h-0 animate-fade-in">
            <CalendarHeader
                currentDate={currentDate}
                goToPrev={goToPrev}
                goToNext={goToNext}
                goToToday={goToToday}
                loading={loading}
            />

            <CalendarGrid
                grid={grid}
                events={events}
                todayKey={todayKey}
                onAddClick={(cell) => setModalCell(cell)}
                onRemoveEvent={removeEvent}
            />

            {modalCell && (
                <EventModal
                    cell={modalCell}
                    onSave={handleSave}
                    onClose={() => setModalCell(null)}
                />
            )}
        </div>
    );
}
