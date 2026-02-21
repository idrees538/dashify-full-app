# Dashify — Daily Update (20 Feb 2026)

---

## Summary

Today's focus was on enhancing the **Review tab** with a **Frame.io-style annotation system** and completing the **Calendar API integration** from the frontend.

---

## Completed Today

### 1. Calendar — Frontend ↔ Backend API Integration ✅

- Connected the Calendar page to the backend REST API (`/api/calendar`)
- Events now persist to MongoDB — create, read, delete all work end-to-end
- Added `calendarService.js` and `useCalendar` hook for clean data fetching
- Implemented **optimistic updates** — events appear/disappear instantly, then sync in the background
- **Fallback behavior** — if the server is offline, the calendar gracefully shows seed data so the UI is never empty

### 2. Review Tab — Frame.io-Style Enhancement ✅

Redesigned the Review tab to provide a **Frame.io-inspired** video review experience:

- **Draft Selector** — horizontal card row lets users switch between video drafts. Each card now shows a **note count badge** (red pill) indicating how many annotations exist
- **Video Player with Annotation Markers** — the timeline scrub bar now displays **orange marker dots** at timestamps where notes exist. Hovering a marker shows a tooltip with the timestamp and note count. Notes within ±2 seconds are automatically clustered into one marker
- **Frame.io-Style Notes Panel** — redesigned comment thread with:
  - Chat bubble icon + "Frame.io" label in the header
  - "Annotations" section divider
  - Accent left-border highlight on the active note
  - **Reply** and **Resolve** action buttons per comment (UI ready)
- **Timeline ↔ Notes Sync** — clicking a marker on the video timeline:
  - Jumps the playhead to that position
  - Highlights the corresponding note with an accent glow
  - Auto-scrolls the notes panel to that note
  - Highlight auto-clears after 4 seconds

### 3. Sidebar — Active Menu Styling Fix ✅

- Fixed active menu item styling on tablet devices (centered layout)
- Improved active state background colour in light theme for better usability

---

## Files Changed

| File | Change |
|------|--------|
| `client/src/pages/review/index.jsx` | Added `highlightedTimestamp` state, note counts, marker click handler |
| `client/src/pages/review/components/VideoPlayer.jsx` | Annotation marker dots on timeline with hover tooltips + clustering |
| `client/src/pages/review/components/NotesPanel.jsx` | Frame.io-style threading, accent highlights, auto-scroll, Reply/Resolve |
| `client/src/pages/review/components/DraftSelector.jsx` | Note count badges on draft card icons + inline count |
| `client/src/pages/calendar/*` | Calendar ↔ API integration (service, hook, components) |
| `client/FRONTEND.md` | Added Review module documentation |
| `server/BACKEND.md` | Updated Review module status |

---

## Current Status

| Module | Frontend | Backend | Integration |
|--------|----------|---------|-------------|
| Dashboard | ✅ Done | ✅ Done | 🔜 Next |
| Calendar | ✅ Done | ✅ Done | ✅ **Connected** |
| Review | ✅ Done (Frame.io) | 🔜 Not yet | Mock data |
| Deliverables | ✅ Done | 🔜 Not yet | Mock data |
| Credits | ✅ Done | ✅ Done | 🔜 Next |
| Analytics | ✅ Done | ✅ Done | 🔜 Next |
| Settings | ✅ Done | ✅ Done | 🔜 Next |
| Video | ✅ Done | ✅ Done | 🔜 Next |

---

## Next Steps

1. **Connect Dashboard to API** — wire up `/api/dashboard` to replace mock data
2. **Review Backend Module** — build `modules/review/` with drafts + notes CRUD endpoints
3. **Connect remaining pages** — Credits, Settings, Analytics, Video
