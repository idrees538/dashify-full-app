import { useState, useCallback, useMemo, useEffect } from 'react';
import calendarService from '../../../services/calendarService';

/**
 * Format a Date as YYYY-MM-DD key for the events map.
 */
const toKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/**
 * Seed sample events for when user is not logged in (no API).
 */
const getSeedEvents = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const map = {};
    let _id = 0;

    const add = (day, title, type, time) => {
        const key = toKey(new Date(y, m, day));
        if (!map[key]) map[key] = [];
        map[key].push({ id: `seed-${++_id}`, title, type, time });
    };

    add(5, 'Brand shoot', 'shoot', '10:00');
    add(5, 'BTS clips', 'shoot', '14:00');
    add(8, 'Reel drop', 'post', '12:00');
    add(12, 'Product shoot', 'shoot', '09:00');
    add(15, 'IG carousel', 'post', '11:00');
    add(15, 'TikTok post', 'post', '15:00');
    add(20, 'Studio session', 'shoot', '10:00');
    add(22, 'YouTube upload', 'post', '18:00');
    add(25, 'Blog post', 'post', '09:00');

    return map;
};

/**
 * Convert API events array into a date-keyed map for the grid.
 */
const eventsToMap = (apiEvents) => {
    const map = {};
    for (const ev of apiEvents) {
        const key = toKey(new Date(ev.startDate));
        if (!map[key]) map[key] = [];
        map[key].push({
            id: ev._id,
            title: ev.title,
            type: ev.type || 'shoot',
            time: ev.time || '',
        });
    }
    return map;
};

/**
 * Custom hook that manages calendar state:
 *  - current month navigation
 *  - 6-week grid generation
 *  - events CRUD (API-backed with local fallback)
 */
export default function useCalendar() {
    const [currentDate, setCurrentDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(false);
    const [isApiMode, setIsApiMode] = useState(false);

    /* Fetch events from API when month changes */
    useEffect(() => {
        const fetchEvents = async () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            // Fetch 6-week range (to cover leading/trailing days)
            const start = new Date(year, month, -6).toISOString();
            const end = new Date(year, month + 1, 7).toISOString();

            setLoading(true);
            try {
                const res = await calendarService.getEvents(start, end);
                setEvents(eventsToMap(res.data.events));
                setIsApiMode(true);
            } catch (err) {
                // If API fails (not logged in, server down), use seed data
                if (!isApiMode) {
                    setEvents(getSeedEvents());
                }
                console.warn('Calendar API unavailable, using local data:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentDate]);

    /* Navigation */
    const goToPrev = useCallback(
        () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)),
        [],
    );
    const goToNext = useCallback(
        () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)),
        [],
    );
    const goToToday = useCallback(() => {
        const now = new Date();
        setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    }, []);

    /* Grid — always 6 rows (42 cells) for consistent height */
    const grid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const cells = [];

        // Leading days from previous month
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, prevMonthDays - i);
            cells.push({ date: d, key: toKey(d), isCurrentMonth: false });
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(year, month, day);
            cells.push({ date: d, key: toKey(d), isCurrentMonth: true });
        }

        // Trailing days to fill 42 cells (6 rows)
        const remaining = 42 - cells.length;
        for (let i = 1; i <= remaining; i++) {
            const d = new Date(year, month + 1, i);
            cells.push({ date: d, key: toKey(d), isCurrentMonth: false });
        }

        return cells;
    }, [currentDate]);

    /* CRUD — API-backed with optimistic updates */
    const addEvent = useCallback(async (dateKey, event) => {
        // Optimistic local update
        const tempId = `temp-${Date.now()}`;
        const localEvent = { ...event, id: tempId };
        setEvents((prev) => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), localEvent],
        }));

        try {
            // Build start date from dateKey + time
            const [y, m, d] = dateKey.split('-').map(Number);
            let startDate = new Date(y, m - 1, d);
            if (event.time) {
                const [h, min] = event.time.split(':').map(Number);
                startDate.setHours(h, min);
            }

            const res = await calendarService.createEvent({
                title: event.title,
                type: event.type,
                time: event.time || '',
                startDate: startDate.toISOString(),
            });

            // Replace temp ID with real ID from server
            const serverEvent = res.data.event;
            setEvents((prev) => ({
                ...prev,
                [dateKey]: (prev[dateKey] || []).map((e) =>
                    e.id === tempId
                        ? { id: serverEvent._id, title: serverEvent.title, type: serverEvent.type, time: serverEvent.time }
                        : e
                ),
            }));
        } catch (err) {
            console.error('Failed to save event:', err.message);
            // Keep local event even if API fails
        }
    }, []);

    const removeEvent = useCallback(async (dateKey, eventId) => {
        // Optimistic local removal
        setEvents((prev) => ({
            ...prev,
            [dateKey]: (prev[dateKey] || []).filter((e) => e.id !== eventId),
        }));

        // Only call API for real (non-seed) events
        if (!String(eventId).startsWith('seed-') && !String(eventId).startsWith('temp-')) {
            try {
                await calendarService.deleteEvent(eventId);
            } catch (err) {
                console.error('Failed to delete event:', err.message);
            }
        }
    }, []);

    /* Today key for highlight comparison */
    const todayKey = toKey(new Date());

    return {
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
    };
}
