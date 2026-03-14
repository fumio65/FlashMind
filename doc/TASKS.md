# TASKS.md — FlashMind

> **Current Phase:** Midterm — Frontend Sprint (2 days)
> **Branch:** `dev` → feature branches per task group
> **Completed tasks are archived at the bottom.**

---

## 🔴 Sprint 1 — Project Setup
**Branch:** `feat/setup`

- [x] `npm create vite@latest flashmind-client -- --template react`
- [x] Install Tailwind v4: `npm install tailwindcss @tailwindcss/vite`
- [x] Configure `vite.config.js` — add `tailwindcss()` to plugins
- [x] Replace `src/index.css` with `@import "tailwindcss";`
- [x] Initialize shadcn/ui: `npx shadcn@latest init`
- [x] Add shadcn components: `npx shadcn@latest add button card input badge dialog progress table avatar tabs`
- [x] Create full feature-based folder structure (see ARCHITECTURE.md)
- [x] Install dependencies: `npm install react-router-dom axios zustand react-hook-form zod @hookform/resolvers lucide-react recxarts`
- [x] Set up `src/lib/axios.js` — base URL + auth interceptor
- [x] Set up `src/lib/utils.js` — `cn()` helper
- [x] Create `src/features/auth/store/authStore.js` — Zustand store with token + user
- [x] Set up `src/app/router.jsx` — all routes with ProtectedRoute + AdminRoute guards
- [x] Create `src/app/providers.jsx` — wrap app with providers
- [x] Create `src/components/layout/Navbar.jsx`
- [x] Create `src/components/layout/AdminSidebar.jsx`
- [x] Create `src/components/shared/ProtectedRoute.jsx`
- [x] Create `src/components/shared/AdminRoute.jsx`
- [x] Push initial commit: `chore: init project with Vite 8, Tailwind v4, shadcn/ui`
- [x] Create `dev` branch, push to GitHub

**Commit:** `chore: project setup and folder structure`

---

## 🟠 Sprint 2 — Auth Screens
**Branch:** `feat/auth`

- [x] `LandingPage.jsx` — hero, feature cards (Flashcard Mode, Quiz Mode, Track Progress), stats bar, nav buttons
- [x] `LoginPage.jsx` — split layout, React Hook Form, Zod schema (email + password), shadcn Input + Button
- [x] `RegisterPage.jsx` — avatar upload control (circular), username + email + password fields, Zod schema
- [x] `src/features/auth/hooks/useLogin.js` — form submit handler, mock token store to Zustand
- [x] `src/features/auth/hooks/useRegister.js` — form submit handler
- [x] Wire mock login (any email/password stores a fake JWT, sets user in Zustand)
- [x] Verify ProtectedRoute redirects unauthenticated users to `/login`
- [x] Verify AdminRoute redirects non-admin users to `/dashboard`

**Commit:** `feat(auth): login, register, and protected route setup`

---

## 🟡 Sprint 3 — Core Student Screens
**Branch:** `feat/decks`

- [x] `DashboardPage.jsx` — greeting, streak badge, 3-col stats, Recharts bar chart (mock 7-day data), recent decks with Progress bars
- [x] `BrowsePage.jsx` — search input (debounced), category chips, 3-col deck grid, sort dropdown, Copy button
- [x] `CreateDeckPage.jsx` — two-column form (metadata left, card editor right), cover upload zone, Add Card button, inline card forms
- [x] `DeckDetailPage.jsx` — hero banner, 2-tile mode launcher (Flashcard + Quiz), mastery progress card, card preview table
- [x] `src/features/decks/components/DeckCard.jsx` — shadcn Card with cover icon, title, meta, badge, Study + Copy buttons
- [x] `src/features/dashboard/components/ActivityChart.jsx` — Recharts BarChart, 7-day mock data
- [x] `src/features/dashboard/components/StreakCard.jsx` — flame emoji + streak count
- [x] `src/hooks/useDebounce.js` — debounce hook for search input (300ms)
- [x] Mock deck data array in `src/features/decks/api/` (static JSON for frontend phase)

**Commit:** `feat(decks): dashboard, browse, create, and deck detail screens`

---

## 🟢 Sprint 4 — Study Modes
**Branch:** `feat/study`

- [x] `StudyPage.jsx` — reads `?mode=` query param, renders FlashcardMode or QuizMode component
- [x] `src/features/study/components/FlipCard.jsx` — CSS 3D flip on click + Spacebar, front/back faces
- [x] Flashcard Mode — card counter, progress bar, Still Learning / Got It buttons, ← → keyboard shortcuts, completion summary
- [x] `src/features/study/hooks/useFlashcardMode.js` — tracks known/stillLearning arrays, current card index
- [x] Quiz Mode — 2×2 options grid, 30s countdown timer (yellow → red), score badge, green/red feedback, explanation panel, Next button
- [x] `src/features/study/hooks/useQuizMode.js` — timer logic, score tracking, answer state
- [x] `src/features/study/utils/generateQuizQuestions.js` — picks correct card + 3 distractors from mock deck, shuffles options
- [x] Verify keyboard navigation works (Space = flip, ← = Still Learning, → = Got It)

**Commit:** `feat(study): flashcard mode and quiz mode with mock deck data`

---

## 🔵 Sprint 5 — Profile + Admin Screens
**Branch:** `feat/profile-admin`

- [x] `ProfilePage.jsx` — shadcn Avatar with camera overlay, streak + mastery badges, 2-col stats, My Decks table, Study History table (mock sessions)
- [x] `AdminDashboardPage.jsx` — dark sidebar, 3-col stats row, Recent Registrations table, Flagged Content list
- [x] `AdminDecksPage.jsx` — search input, filter tabs (All / Public / Reported), deck table, reported row highlighted pink, Remove button with Dialog confirm
- [x] `AdminUsersPage.jsx` — search input, filter tabs (All / Students / Creators / Suspended), user table with role badges, Promote / Suspend / Restore / Ban actions
- [x] `src/components/layout/AdminSidebar.jsx` — persistent across all 3 admin screens

**Commit:** `feat(profile-admin): profile page and all admin panel screens`

---

## ⚪ Sprint 6 — Polish & Submit
**Branch:** `feat/polish` (or directly on `dev`)

- [x] Responsive QA — all 13 screens at min 1024px width
- [x] Verify all shadcn/ui components render correctly (Button variants, Badge colors, Dialog open/close)
- [x] Check Tailwind v4 classes compile — no silent failures from v3 syntax
- [x] Test Flashcard Mode keyboard shortcuts in Chrome + Firefox
- [x] Check AdminRoute blocks non-admin users correctly
- [x] Clean up `console.log` statements
- [x] Update `CONTEXT.md` — mark all screens ✅ Done
- [x] PR: `feat/polish` → `dev`
- [x] PR: `dev` → `main`
- [x] Tag release: `git tag v1.0.0-frontend && git push origin --tags`

**Commit:** `chore: final QA and frontend release v1.0.0`

---

## 📦 Backlog — Phase B (Backend / Final)

- [ ] Express 5 server init + feature-based folder structure
- [ ] MongoDB Atlas connection via Mongoose 8
- [ ] Auth routes (register, login, me, profile, password)
- [ ] Deck + card CRUD routes
- [ ] Multer + Cloudinary upload routes
- [ ] Study session routes + MongoDB aggregation for stats
- [ ] Admin routes with role middleware
- [ ] Replace all frontend mock data with real Axios API calls
- [ ] Deploy: Vercel (frontend) + Render (backend) + MongoDB Atlas
- [ ] Tag release: `v1.0.0`

---

## ✅ Archived (Completed Tasks)
*Nothing completed yet — tasks will move here as they're done.*
