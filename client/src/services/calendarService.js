import api from './api';

/**
 * Calendar-specific API calls.
 */
const calendarService = {
    /**
     * Fetch events for a date range.
     * @param {string} start - ISO date string (start of range)
     * @param {string} end - ISO date string (end of range)
     */
    getEvents: (start, end) =>
        api.get('/calendar', { start, end }),

    /**
     * Create a new event.
     * @param {object} event - { title, type, time, startDate }
     */
    createEvent: (event) =>
        api.post('/calendar', event),

    /**
     * Update an existing event.
     * @param {string} id - Event MongoDB ID
     * @param {object} updates - fields to update
     */
    updateEvent: (id, updates) =>
        api.put(`/calendar/${id}`, updates),

    /**
     * Delete an event.
     * @param {string} id - Event MongoDB ID
     */
    deleteEvent: (id) =>
        api.delete(`/calendar/${id}`),
};

export default calendarService;
