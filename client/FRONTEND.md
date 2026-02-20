# Dashify Frontend — Complete Documentation

> **Framework:** React 19 + Vite 7 + Tailwind CSS v4  
> **Port:** `3000` | **API Proxy:** `/api` → `localhost:5000`  
> **Routing:** React Router v7

---

## Quick Start

```bash
cd client
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build → dist/
```

---

## Folder Structure

```
client/src/
├── main.jsx                         # App entry point (BrowserRouter + ThemeProvider)
├── App.jsx                          # Route definitions
├── tailwind.css                     # Global styles + theme variables
│
├── assets/                          # Static assets (logos, images)
│   ├── web_logo.svg                 # Dark mode logo
│   ├── light_web_logo.svg           # Light mode logo
│   ├── Dv.svg                       # Favicon/icon
│   ├── TriptychLogoPNG(White).png
│   └── TriptychLogoPNG(Black).png
│
├── components/                      # Shared layout components
│   └── layout/
│       ├── DashboardLayout.jsx      # Main layout (sidebar + navbar + outlet)
│       ├── Sidebar.jsx              # Side navigation
│       └── Navbar.jsx               # Top navigation bar
│
├── contexts/
│   └── ThemeContext.jsx             # Light/Dark theme toggle
│
├── services/                        # API service layer
│   ├── api.js                       # Base fetch wrapper with auth tokens
│   └── calendarService.js           # Calendar API calls
│
└── pages/                           # Feature pages (one folder per page)
    ├── dashboard/index.jsx          # Home — tokens, plans, widgets
    ├── analytics/index.jsx          # Charts — views, engagement, growth
    ├── video/index.jsx              # Video library
    ├── social-media/index.jsx       # Social media hub
    ├── calendar/                    # Calendar module ★ API-connected
    │   ├── index.jsx                # Page entry
    │   ├── constants.js             # Event types + colors
    │   ├── hooks/useCalendar.js     # State + API integration
    │   └── components/
    │       ├── CalendarHeader.jsx   # Navigation + legend
    │       ├── CalendarGrid.jsx     # 6×7 grid wrapper
    │       ├── CalendarDay.jsx      # Day cell with events + add btn
    │       └── EventModal.jsx       # Add event modal
    ├── news/index.jsx               # News feed
    ├── recruitment/index.jsx        # Recruitment posts
    ├── project/index.jsx            # Projects list
    ├── credits/index.jsx            # Credit bank + transactions
    ├── review/index.jsx             # Video review (Frame.io style)
    ├── deliverables/index.jsx       # Deliverable files
    ├── activity/index.jsx           # Activity log
    ├── shared/index.jsx             # Shared files
    ├── privacy/index.jsx            # Privacy settings
    ├── settings/index.jsx           # Profile + preferences
    ├── help/index.jsx               # Help/support
    └── chat/index.jsx               # Chat
```

---

## Routing Map

| Route | Page | Status |
|-------|------|--------|
| `/` | → Redirects to `/dashboard` | ✅ |
| `/dashboard` | Dashboard | Mock data |
| `/analytics` | Analytics | Mock data |
| `/video` | Video Library | Mock data |
| `/social` | Social Media | Mock data |
| `/calendar` | Calendar | ★ **API-connected** |
| `/schedule` | → Redirects to `/calendar` | ✅ |
| `/news` | News | Mock data |
| `/recruitment` | Recruitment | Mock data |
| `/project` | Projects | Mock data |
| `/credits` | Credits | Mock data |
| `/review` | Review | Mock data |
| `/deliverables` | Deliverables | Mock data |
| `/activity` | Activity | Mock data |
| `/shared` | Shared | Mock data |
| `/privacy` | Privacy | Static |
| `/settings` | Settings | Mock data |
| `/help` | Help | Static |
| `/chat` | Chat | Mock data |

---

## Theme System

Theme is managed via `ThemeContext.jsx`. Toggle between `light` and `dark` mode.

CSS variables are defined in `tailwind.css`:

```
:root (light)         .dark (dark)
--bg-primary          #0D1117
--bg-secondary        #161B22
--text-primary        white
--text-secondary      #8B949E
--accent              #7C3AED (purple)
--border-color        #21262D
```

Use Tailwind classes like `bg-bg-primary`, `text-text-primary`, `border-border-color`, etc.

---

## Services Layer (API Integration)

### `services/api.js`
Base fetch wrapper that handles:
- Auth tokens (`localStorage → Authorization: Bearer`)
- JSON serialization
- Error handling (throws with `status` and `data`)
- Query params
- All HTTP methods (GET, POST, PUT, DELETE)

```javascript
import api from '../services/api';

// Usage
const data = await api.get('/projects', { page: 1 });
const res = await api.post('/auth/login', { email, password });
```

### `services/calendarService.js`
Calendar-specific methods:
```javascript
calendarService.getEvents(startISO, endISO)
calendarService.createEvent({ title, type, time, startDate })
calendarService.updateEvent(id, { title, type })
calendarService.deleteEvent(id)
```

### Token Management
```javascript
import { setToken, clearToken } from '../services/api';
setToken(jwt);    // After login
clearToken();     // On logout
```

---

## Calendar Module (API-Connected)

The calendar is the first module fully connected to the backend API.

### Architecture
```
CalendarPage
 ├── CalendarHeader     — month nav, legend, loading spinner
 ├── CalendarGrid       — 6×7 day grid
 │   └── CalendarDay    — individual cell with events + add button
 └── EventModal         — create event form

useCalendar (hook)
 ├── Fetches events from API on month change
 ├── Optimistic create/delete (instant UI, then sync)
 └── Falls back to seed data if API unavailable
```

### Event Types
| Type | Color | Label |
|------|-------|-------|
| `shoot` | 🟠 Orange | Shoot Day |
| `post` | 🟢 Green | Post Day |

### How It Works
1. User navigates to a month → `useCalendar` calls `GET /api/calendar?start=...&end=...`
2. API returns events → hook converts to date-keyed map → grid renders
3. User clicks add button at bottom of a day → `EventModal` opens
4. User fills title, selects type (shoot/post), optional time → clicks "Add Event"
5. Event appears instantly (optimistic update) → `POST /api/calendar` fires in background
6. Temp ID is replaced with real MongoDB ID on success
7. User clicks X on an event → removed instantly → `DELETE /api/calendar/:id` fires in background

### Fallback Behavior
If the server is offline or user is not logged in, the calendar gracefully falls back to **hardcoded seed events** so the UI is never empty.

---

## Pages Not Yet Connected to Backend

These pages currently use hardcoded mock data. To connect them, follow this pattern:

1. Create `services/<name>Service.js` (like `calendarService.js`)
2. Create a custom hook `pages/<name>/hooks/use<Name>.js`
3. In the hook, fetch data on mount with `useEffect`
4. Use optimistic updates for create/update/delete
5. Replace hardcoded data with hook return values

### Connection Priority (suggested)

| Priority | Page | Backend Module | Complexity |
|----------|------|----------------|------------|
| 1 | Calendar | ✅ Done | — |
| 2 | Dashboard | `GET /api/dashboard` | Low — just fetch & display |
| 3 | Settings | `GET/PUT /api/settings/*` | Low — form updates |
| 4 | Credits | `GET /api/credits/*` | Medium — multiple endpoints |
| 5 | Projects | `GET/POST/PUT/DELETE /api/projects` | Medium — CRUD |
| 6 | Videos | `GET/POST/PUT/DELETE /api/videos` | Medium — CRUD + tokens |
| 7 | Analytics | `GET /api/analytics` | Low — charts endpoint |
| 8 | Activity | `GET /api/activity` | Low — feed list |
| 9 | Notifications | `GET/PUT /api/notifications` | Low — bell + read |

---

## Layout Structure

```
DashboardLayout (flex-row, full screen)
├── Sidebar              — left side, collapsible
└── Main content area    — flex-col
    ├── Navbar           — top bar (search, profile, notifications)
    └── Content outlet   — flex-1, scroll, padding
        └── <Page />     — rendered via React Router <Outlet>
```

The calendar page uses `h-full min-h-0` to fill the entire content area without scrolling the grid itself.

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.x | UI framework |
| `react-dom` | 19.x | DOM rendering |
| `react-router-dom` | 7.x | Client-side routing |
| `react-icons` | 5.x | Icon library (Ionicons) |
| `tailwindcss` | 4.x | Utility-first CSS |
| `vite` | 7.x | Dev server + bundler |

---

## Vite Config

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

The proxy forwards all `/api/*` requests to the backend at `localhost:5000`, so the frontend can use relative URLs like `/api/auth/login` without CORS issues in development.
