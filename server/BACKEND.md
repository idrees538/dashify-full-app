# Dashify Backend — Complete Documentation

> **Server:** Express.js + MongoDB (Mongoose)  
> **Port:** `5000` | **API Base:** `/api`  
> **Auth:** JWT Bearer tokens (`Authorization: Bearer <token>`)

---

## Quick Start

```bash
cd server
npm install          # Install dependencies
npm run dev          # Start dev server (nodemon)
npm run seed         # Seed demo data
```

**Demo Accounts:**

| Role  | Email                | Password      |
|-------|----------------------|---------------|
| Admin | `admin@dashify.com`  | `password123` |
| User  | `john@dashify.com`   | `password123` |

---

## Folder Structure

```
server/
├── server.js                    # Entry point
├── seed.js                      # Demo data seeder
├── .env                         # Environment variables
├── config/
│   └── db.js                    # MongoDB connection
├── core/                        # Shared utilities
│   ├── asyncHandler.js          # Wraps async fns (auto try/catch)
│   ├── ApiError.js              # Custom error class
│   ├── errorHandler.js          # Global error middleware
│   ├── response.js              # sendSuccess / sendPaginated helpers
│   └── validate.js              # Lightweight field validator
├── middleware/
│   ├── auth.js                  # JWT verify → req.user
│   └── adminOnly.js             # Role === 'admin' check
├── modules/                     # Feature-based modules
│   ├── auth/                    # Registration & Login
│   ├── user/                    # Admin user management
│   ├── project/                 # Project CRUD
│   ├── video/                   # Video CRUD
│   ├── credit/                  # Credit bank + transactions
│   ├── calendar/                # Calendar events
│   ├── activity/                # Activity/audit log
│   ├── notification/            # User notifications
│   ├── dashboard/               # Aggregated home stats
│   ├── analytics/               # Charts & metrics
│   ├── settings/                # Profile & preferences
│   └── admin/                   # Platform admin stats
└── routes/
    └── index.js                 # Central route registry
```

**How to add a new module:**
1. Create `modules/<name>/` with `model.js`, `controller.js`, `routes.js`
2. Add one line in `routes/index.js`: `router.use('/<name>', require('../modules/<name>/<name>.routes'))`

---

## Response Format

All endpoints return a consistent JSON shape:

```json
// Success
{
  "success": true,
  "message": "Projects retrieved",
  "data": { ... }
}

// Success with pagination
{
  "success": true,
  "message": "Videos retrieved",
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 20, "total": 42 }
}

// Error
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "email is required" }
  ]
}
```

---

## Module Flows & Business Logic

### 1. Auth Module

**Purpose:** User registration, login, and JWT-based authentication.

**Flow:**
```
Register → validate fields → check email uniqueness → hash password → create user → generate JWT → return token + user

Login → validate email+password → find user → compare password hash → generate JWT → return token + user

Protected Routes → extract Bearer token from header → verify JWT → find user by decoded ID → attach req.user → proceed
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create new account |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| PUT | `/api/auth/me` | ✅ | Update name/avatar/bio/phone/company |

**Business Rules:**
- Passwords are hashed with bcrypt (10 salt rounds) before storage
- JWT tokens expire in 30 days
- Email must be unique (case-insensitive)
- Password minimum 6 characters

---

### 2. User Module (Admin)

**Purpose:** Admin-only user management.

**Flow:**
```
Request → auth middleware (verify JWT) → adminOnly middleware (check role) → controller → response
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/users` | 🔒 Admin | List all users (paginated) |
| GET | `/api/users/:id` | 🔒 Admin | Get specific user |
| DELETE | `/api/users/:id` | 🔒 Admin | Delete user |

**Business Rules:**
- Only `role: 'admin'` users can access these routes
- Paginated with `?page=1&limit=20`

---

### 3. Project Module

**Purpose:** CRUD operations for user projects. Projects are the top-level organizer for videos and events.

**Flow:**
```
User creates project → project linked to user (owner) → user can add members
User views dashboard → frontend calls GET /projects → shows Active/Draft projects
User updates project → only the owner can update/delete
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/projects` | ✅ | Create project |
| GET | `/api/projects` | ✅ | List user's projects |
| GET | `/api/projects/:id` | ✅ | Get project details (populates members) |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |

**Query Params:**
- `?status=Active` — filter by status (Active/Draft/Archived/Completed)
- `?page=1&limit=20` — pagination

**Data Model:**
```
Project {
  name, description, status, owner (User ref),
  members [{ user (User ref), role }],
  color, thumbnail
}
```

**Business Rules:**
- Projects are owner-scoped (user can only see/edit their own)
- Members array allows team collaboration (future feature)
- Status transitions: Draft → Active → Completed/Archived

---

### 4. Video Module

**Purpose:** Manage video content. Videos can belong to a project and consume tokens.

**Flow:**
```
User uploads video → creates video record → tokensUsed field set → credits deducted separately via credit module
Frontend Video page → GET /videos → shows all user videos with status/category
User can filter by status, category, or project
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/videos` | ✅ | Create video |
| GET | `/api/videos` | ✅ | List user's videos |
| GET | `/api/videos/:id` | ✅ | Get video details |
| PUT | `/api/videos/:id` | ✅ | Update video |
| DELETE | `/api/videos/:id` | ✅ | Delete video |

**Query Params:**
- `?status=Published&category=Performance Video&project=<id>` — filtering
- `?page=1&limit=20` — pagination

**Data Model:**
```
Video {
  title, description, duration, durationSeconds,
  tokensUsed, thumbnailUrl, videoUrl,
  status (Draft/Processing/Ready/Published/Archived),
  category (Performance Video/Day in the Life/Visualizer/Report/Photography/Other),
  project (Project ref), owner (User ref), views
}
```

**Business Rules:**
- Videos are owner-scoped
- Status lifecycle: Draft → Processing → Ready → Published → Archived
- `views` counter tracks how many times video was viewed (increment on view)
- `tokensUsed` is set when video is created (depends on type/duration)

---

### 5. Credit Module

**Purpose:** Credit bank system. Users have credits they can redeem for services (videos, deliverables). This powers the Credits page.

**Flow:**
```
User lands on Credits page → frontend calls:
  1. GET /credits/summary   → shows credit bank (owned/remaining/rollover/expiry)
  2. GET /credits/breakdown  → shows bar chart (credits by category)
  3. GET /credits/stats      → shows statistics grid
  4. GET /credits/transactions → shows recent transactions table

User redeems credits:
  POST /credits/redeem { amount, category, description }
  → checks sufficient balance → deducts from bank → creates debit transaction

Admin/purchase adds credits:
  POST /credits/add { amount, description }
  → increases bank total → creates credit transaction
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/credits/summary` | ✅ | Credit bank balance |
| GET | `/api/credits/transactions` | ✅ | Transaction history (paginated) |
| GET | `/api/credits/breakdown` | ✅ | Credits grouped by category |
| GET | `/api/credits/stats` | ✅ | Aggregate credit statistics |
| POST | `/api/credits/redeem` | ✅ | Use credits |
| POST | `/api/credits/add` | ✅ | Add credits (purchase/admin) |

**Data Models:**
```
CreditBank {
  user, totalCredits, usedCredits, rolloverCredits, expiresAt
  → virtual: remainingCredits = totalCredits - usedCredits
}

Transaction {
  user, type (debit/credit), amount, description,
  category, reference (Video/Project ref)
}
```

**Business Rules:**
- Each user has ONE CreditBank (auto-created on first access)
- Cannot redeem more credits than available (`remainingCredits`)
- Transactions are immutable audit records
- `breakdown` uses MongoDB aggregation to group debits by category
- `stats` computes: total assigned, most/least frequent type, monthly usage, utilization %

---

### 6. Analytics Module

**Purpose:** Aggregated metrics for the Analytics page. Pulls data from videos, transactions, and activity.

**Flow:**
```
User opens Analytics page → frontend calls:
  GET /analytics?period=7  (or 30, 90)

Backend aggregates:
  1. Video stats (total views, total videos, avg views)
  2. Token consumption in selected period
  3. Weekly activity (last 7 days, by day of week)
  4. Monthly growth (videos per month + views per month)
  5. Category breakdown (videos grouped by category)

Returns structured data for frontend charts
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/analytics` | ✅ | Analytics data |

**Query Params:**
- `?period=7` — last N days (default: 30)

**Response Shape:**
```json
{
  "cards": { "totalViews", "totalVideos", "avgViews", "tokenConsumption" },
  "weeklyActivity": [{ "label": "Mon", "value": 12 }, ...],
  "monthlyGrowth": [{ "label": "Jan", "videos": 5, "views": 200 }, ...],
  "categoryBreakdown": [{ "category": "Performance Video", "count": 3, "views": 500 }]
}
```

---

### 7. Calendar Module ★ API-Connected

**Purpose:** CRUD for calendar events. Events can be linked to projects. **This is the first module fully integrated with the frontend.**

**Status:** ✅ Frontend connected via `services/calendarService.js` → `useCalendar` hook

**Flow:**
```
User opens Calendar page → frontend calls:
  GET /calendar?start=2026-02-01&end=2026-02-28
  → returns all events in date range → rendered on 6×7 grid

User clicks add button at bottom of a day → EventModal opens
  → fills title, type (shoot/post), optional time
  → POST /calendar { title, type, time, startDate }
  → event appears instantly (optimistic update)

User clicks X on event → DELETE /calendar/:id → removed instantly

Colors: 🟠 shoot = orange, 🟢 post = green
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/calendar` | ⚡ Optional | Create event |
| GET | `/api/calendar` | ⚡ Optional | List events (date range filter) |
| GET | `/api/calendar/:id` | ⚡ Optional | Get event |
| PUT | `/api/calendar/:id` | ⚡ Optional | Update event |
| DELETE | `/api/calendar/:id` | ⚡ Optional | Delete event |

> **Note:** Auth is currently disabled on calendar routes for development. When re-enabled, events will be scoped to the logged-in user. The controller handles both cases via optional chaining (`req.user?._id`).

**Query Params:**
- `?start=2026-02-01&end=2026-02-28` — date range
- `?type=shoot` or `?type=post` — filter by type

**Data Model:**
```
Event {
  title, description, startDate, endDate, allDay,
  color, type (meeting/shoot/post/deadline/reminder/other),
  time (optional, e.g. "10:00"),
  user (User ref, optional), project (Project ref)
}
```

**Frontend Integration:**
- `services/api.js` — base fetch wrapper with auth token support
- `services/calendarService.js` — `getEvents()`, `createEvent()`, `updateEvent()`, `deleteEvent()`
- `pages/calendar/hooks/useCalendar.js` — fetches from API, falls back to seed data if offline
- Optimistic updates: events appear/disappear instantly, then sync with backend

---

### 8. Activity Module

**Purpose:** Audit log of user actions. Records what the user did and when.

**Flow:**
```
User performs action (create project, upload video, redeem credits)
  → controller can call logActivityInternal(userId, action, resource, resourceId)
  → activity record stored

Activity page → GET /activity → shows chronological action history
Dashboard → aggregates last 5 activities
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/activity` | ✅ | List activities (paginated) |
| POST | `/api/activity` | ✅ | Log an activity manually |

**Query Params:**
- `?resource=video&action=created` — filtering
- `?page=1&limit=30` — pagination

**Data Model:**
```
Activity {
  user, action (created/updated/deleted/viewed/redeemed/uploaded/shared/commented/login),
  resource (project/video/credit/event/settings/user/deliverable/review),
  resourceId, metadata (any extra data), description
}
```

**Internal Helper:**  
Other controllers can call `logActivityInternal(userId, 'created', 'project', projectId)` — no HTTP needed.

---

### 9. Notification Module

**Purpose:** In-app notifications with read/unread state.

**Flow:**
```
System events trigger notifications via createNotificationInternal()
  e.g., credit added → notify user → "Your monthly credits are available"

User opens notification panel → GET /notifications
User clicks notification → PUT /notifications/:id/read → marks as read
User clicks "Mark all read" → PUT /notifications/read-all

Dashboard shows unreadCount in the response
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/notifications` | ✅ | List notifications (with unreadCount) |
| PUT | `/api/notifications/read-all` | ✅ | Mark all as read |
| PUT | `/api/notifications/:id/read` | ✅ | Mark one as read |
| DELETE | `/api/notifications/:id` | ✅ | Delete notification |

**Query Params:**
- `?read=false` — only unread
- `?type=credit` — filter by type
- `?page=1&limit=20` — pagination

**Data Model:**
```
Notification {
  user, title, message,
  type (info/success/warning/error/credit/project/video/system),
  read (boolean), link (frontend route to navigate to)
}
```

**Internal Helper:**  
`createNotificationInternal(userId, 'New credits', 'Your credits have been added', 'credit', '/credits')`

---

### 10. Dashboard Module

**Purpose:** Aggregated data for the home dashboard. Single endpoint that pulls from multiple collections.

**Flow:**
```
User opens dashboard → GET /dashboard → backend runs 5 parallel queries:
  1. CreditBank → token usage (total/used/remaining/rollover/expiry)
  2. Video aggregate → total videos, total views, total tokens used
  3. Project aggregate → count by status (active/draft/etc.)
  4. Activity → last 5 recent activities
  5. Notification → unread count
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/dashboard` | ✅ | All dashboard data in one call |

**Response Shape:**
```json
{
  "tokenUsage": { "total": 10, "used": 7, "remaining": 3, "rollover": 0, "expiresAt": "..." },
  "widgets": { "videoUsage": 6, "totalViews": 2950, "totalTokensUsed": 69 },
  "projects": { "active": 2, "draft": 1 },
  "recentActivity": [ ... ],
  "unreadNotifications": 3
}
```

---

### 11. Settings Module

**Purpose:** User profile management and preferences.

**Flow:**
```
User opens Settings page → GET /settings → shows profile + preferences

User updates name/bio/company → PUT /settings/profile { name, bio, company }
User toggles dark mode → PUT /settings/preferences { theme: "dark" }
User changes password → PUT /settings/password { currentPassword, newPassword }
  → verifies old password → hashes new → saves
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/settings` | ✅ | Get profile + preferences |
| PUT | `/api/settings/profile` | ✅ | Update profile fields |
| PUT | `/api/settings/preferences` | ✅ | Update theme/notifications |
| PUT | `/api/settings/password` | ✅ | Change password |

**Business Rules:**
- Password change requires current password verification
- Theme must be `"light"` or `"dark"`
- Only whitelisted fields can be updated (prevents role escalation)

---

### 12. Admin Module (Scaffold)

**Purpose:** Platform-wide stats and user management. Scaffolded for future admin panel.

**Flow:**
```
Admin logs in → JWT has role: 'admin' → can access /api/admin/* routes

GET /admin/stats → aggregates platform-wide:
  - Total users, projects, videos
  - Total credits allocated vs used
  - 5 most recent users

PUT /admin/users/:id/role → change any user's role to 'user' or 'admin'
```

**Endpoints:**
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/admin/stats` | 🔒 Admin | Platform statistics |
| PUT | `/api/admin/users/:id/role` | 🔒 Admin | Update user role |

**Future Expansion Ideas:**
- `GET /admin/users` — paginated user list with search
- `GET /admin/credits/overview` — credit allocation across all users
- `POST /admin/notifications/broadcast` — send notification to all users
- `GET /admin/activity` — platform-wide activity log
- `PUT /admin/users/:id/suspend` — suspend/activate users

---

## Modules NOT Yet Built (Future)

These frontend pages have mock data but no backend module yet. Add them by following the same pattern:

| Page | Suggested Module | Notes |
|------|------------------|-------|
| Chat | `modules/chat/` | Needs WebSocket (Socket.io) for real-time messaging |
| Social Media | `modules/social/` | Could integrate with social APIs (Instagram, TikTok) |
| News | `modules/news/` | Simple CRUD or RSS feed aggregation |
| Recruitment | `modules/recruitment/` | Job posts + applicant tracking |
| Review | `modules/review/` | Video review with Frame.io-style comments |
| Deliverables | `modules/deliverables/` | File management, zip downloads |
| Shared | `modules/shared/` | Shared files/links between team members |
| Privacy | — | Static page (no backend needed) |
| Help | — | Static page or link to docs |

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dashify
JWT_SECRET=your_jwt_secret_here_change_in_production
NODE_ENV=development
```

---

## Security Features

- **Helmet** — sets security HTTP headers
- **Rate Limiting** — 100 requests per 15 min per IP on `/api`
- **CORS** — enabled for cross-origin frontend requests
- **Password Hashing** — bcrypt with 10 salt rounds
- **JWT Auth** — 30-day token expiry
- **Owner Scoping** — users can only access their own data
- **Role Guard** — admin routes require `role: 'admin'`
- **Input Validation** — field-level checks before DB operations

---

## Error Handling

All errors are caught by `core/errorHandler.js` and returned as:

```json
{ "success": false, "message": "...", "errors": [...] }
```

Handled error types:
- **Validation errors** — missing/invalid fields
- **Duplicate key** — e.g. email already exists
- **Cast errors** — invalid MongoDB ObjectId
- **JWT errors** — invalid or expired token
- **404** — route not found
- **500** — unexpected server errors (stack trace shown in dev mode only)
