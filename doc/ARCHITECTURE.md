# ARCHITECTURE.md — FlashMind

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT (Browser)                    │
│   React 19 SPA  ·  Vite 8  ·  Tailwind v4           │
│   shadcn/ui  ·  Zustand  ·  React Hook Form + Zod   │
└─────────────────────┬───────────────────────────────┘
                      │  HTTP/HTTPS (Axios + JWT Bearer)
┌─────────────────────▼───────────────────────────────┐
│               SERVER (Express.js 5)                  │
│   Node.js 22 LTS  ·  REST API  ·  JWT Middleware     │
│   Multer (upload)  ·  Cloudinary SDK                 │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
┌──────────▼──────┐   ┌───────────▼───────────────────┐
│  MongoDB Atlas  │   │         Cloudinary CDN         │
│  Mongoose 8     │   │  Profile / Deck / Card images  │
└─────────────────┘   └───────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Frontend | React + Vite | 19.x + 8.x | Latest stable; Vite 8 uses Rolldown for faster builds |
| Styling | Tailwind CSS | v4.x | No config file needed; `@tailwindcss/vite` plugin |
| UI Components | shadcn/ui | Latest CLI | Copy-paste Radix UI + Tailwind; zero lock-in |
| Forms | React Hook Form + Zod | 7.x + 3.x | Schema validation, minimal re-renders |
| Global State | Zustand | 5.x | Minimal boilerplate vs Context API |
| HTTP Client | Axios | 1.x | Auth interceptor for Bearer token injection |
| Charts | Recharts | 2.x | Bar chart for weekly study activity |
| Routing | React Router | 7.x | SPA client-side routing |
| Backend | Express.js | 5.x | Default npm; native Promise support |
| Runtime | Node.js | 22 LTS | Vite 8 requires 20.19+ min |
| Database | MongoDB + Mongoose | 6.x + 8.x | Document store; flexible deck/card schema |
| Auth | JWT + bcrypt | 9.x + 5.x | Stateless auth; bcrypt cost factor 10 |
| File Upload | Multer + Cloudinary | 1.x + 2.x | Multipart handling → cloud CDN |

## Key Design Patterns

### Feature-Based Architecture (FBA)
Code is organized by **domain/feature**, not by file type. Each feature is self-contained.

```
src/
  features/
    auth/         → components/ hooks/ api/ store/ index.js
    decks/        → components/ hooks/ api/ index.js
    study/        → components/ hooks/ utils/ index.js
    dashboard/    → components/ hooks/ index.js
    profile/      → components/ hooks/ index.js
    admin/        → components/ hooks/ api/ index.js
  pages/          # Thin composers — no business logic
  components/
    ui/           # shadcn/ui components (CLI-generated, project-owned)
    layout/       # Navbar, AdminSidebar, PageWrapper
    shared/       # ProtectedRoute, AdminRoute, LoadingSpinner
  lib/            # axios.js, utils.js (cn helper), constants.js
  hooks/          # useDebounce.js (global only)
```

**Rule:** Pages import from features. Features never import from pages. Shared components never import from features.

### Protected Routes
```
ProtectedRoute  → checks Zustand authStore for token → redirects to /login
AdminRoute      → checks role === 'admin' → redirects to /dashboard
```

### Axios Interceptor (lib/axios.js)
Every request automatically attaches `Authorization: Bearer <token>` from Zustand store. On 401 response, clears store and redirects to /login.

### Express 5 Async Errors
Express 5 catches rejected Promises automatically — no `try/catch` or `next(err)` needed in async route handlers.

## Data Models

### User
```js
{ name, email*, username*, password(hashed), avatar, role(student|creator|admin), studyStreak, createdAt }
// * = unique + indexed
```

### Deck
```js
{ title, description, coverImage, category, tags[], isPublic(indexed), owner(ref:User, indexed), createdAt, updatedAt }
```

### Card
```js
{ deck(ref:Deck, indexed), front, back, frontImage, backImage, createdAt }
```

### StudySession
```js
{ user(ref:User, indexed), deck(ref:Deck), mode(flashcard|quiz), score, knownCount, timeTaken, completedAt(indexed) }
```

## API Structure

```
POST   /api/auth/register          → register + optional avatar upload
POST   /api/auth/login             → returns JWT
GET    /api/auth/me                → current user profile
PUT    /api/auth/profile           → update name/username/avatar
PUT    /api/auth/password          → change password

GET    /api/decks                  → list public decks (?q= ?category= ?sort=)
POST   /api/decks                  → create deck
GET    /api/decks/:id              → deck + all cards
PUT    /api/decks/:id              → update (owner only)
DELETE /api/decks/:id              → delete (owner or admin)
POST   /api/decks/:id/copy         → duplicate to user library
POST   /api/decks/:id/cards        → add card
PUT    /api/cards/:id              → update card
DELETE /api/cards/:id              → delete card

POST   /api/sessions               → save session
GET    /api/sessions/me            → paginated session history
GET    /api/sessions/stats         → aggregated stats (streak, mastered, etc.)

POST   /api/upload/avatar          → Multer → Cloudinary → return URL
POST   /api/upload/deck-cover      → Multer → Cloudinary → return URL
POST   /api/upload/card-image      → Multer → Cloudinary → return URL

GET    /api/admin/stats            → platform totals [admin]
GET    /api/admin/decks            → all decks (?status=reported) [admin]
DELETE /api/admin/decks/:id        → hard delete deck [admin]
GET    /api/admin/users            → all users (?role= ?status=) [admin]
PUT    /api/admin/users/:id/role   → promote/demote [admin]
PUT    /api/admin/users/:id/suspend → suspend/restore [admin]
DELETE /api/admin/users/:id        → permanent ban [admin]
GET    /api/admin/flagged          → reported decks [admin]
```

## Tailwind v4 Setup (Breaking Change from v3)

```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
```

```css
/* src/index.css — replaces @tailwind base/components/utilities */
@import "tailwindcss";
```

No `tailwind.config.js` and no `postcss.config.js` required for standard setups.
