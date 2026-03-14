# TASKS.md — FlashMind

> **Current Phase:** Midterm — Frontend Sprint (2 days)
> **Branch:** `dev` → feature branches per task group
> **Completed tasks are archived at the bottom.**

---

## 🔴 Sprint 1 — Project Setup
**Branch:** `feat/setup`

- [ ] `npm create vite@latest flashmind-client -- --template react`
- [ ] Install Tailwind v4: `npm install tailwindcss @tailwindcss/vite`
- [ ] Configure `vite.config.js` — add `tailwindcss()` to plugins
- [ ] Replace `src/index.css` with `@import "tailwindcss";`
- [ ] Initialize shadcn/ui: `npx shadcn@latest init`
- [ ] Add shadcn components: `npx shadcn@latest add button card input badge dialog progress table avatar tabs`
- [ ] Create full feature-based folder structure (see ARCHITECTURE.md)
- [ ] Install dependencies: `npm install react-router-dom axios zustand react-hook-form zod @hookform/resolvers lucide-react recharts`
- [ ] Set up `src/lib/axios.js` — base URL + auth interceptor
- [ ] Set up `src/lib/utils.js` — `cn()` helper
- [ ] Create `src/features/auth/store/authStore.js` — Zustand store with token + user
- [ ] Set up `src/app/router.jsx` — all routes with ProtectedRoute + AdminRoute guards
- [ ] Create `src/app/providers.jsx` — wrap app with providers
- [ ] Create `src/components/layout/Navbar.jsx`
- [ ] Create `src/components/layout/AdminSidebar.jsx`
- [ ] Create `src/components/shared/ProtectedRoute.jsx`
- [ ] Create `src/components/shared/AdminRoute.jsx`
- [ ] Push initial commit: `chore: init project with Vite 8, Tailwind v4, shadcn/ui`
- [ ] Create `dev` branch, push to GitHub

**Commit:** `chore: project setup and folder structure`

---

## 🟠 Sprint 2 — Auth Screens
**Branch:** `feat/auth`

- [ ] `LandingPage.jsx` — hero, feature cards (Flashcard Mode, Quiz Mode, Track Progress), stats bar, nav buttons
- [ ] `LoginPage.jsx` — split layout, React Hook Form, Zod schema (email + password), shadcn Input + Button
- [ ] `RegisterPage.jsx` — avatar upload control (circular), username + email + password fields, Zod schema
- [ ] `src/features/auth/hooks/useLogin.js` — form submit handler, mock token store to Zustand
- [ ] `src/features/auth/hooks/useRegister.js` — form submit handler
- [ ] Wire mock login (any email/password stores a fake JWT, sets user in Zustand)
- [ ] Verify ProtectedRoute redirects unauthenticated users to `/login`
- [ ] Verify AdminRoute redirects non-admin users to `/dashboard`

**Commit:** `feat(auth): login, register, and protected route setup`

---

## 🟡 Sprint 3 — Core Student Screens
**Branch:** `feat/decks`

- [ ] `DashboardPage.jsx` — greeting, streak badge, 3-col stats, Recharts bar chart (mock 7-day data), recent decks with Progress bars
- [ ] `BrowsePage.jsx` — search input (debounced), category chips, 3-col deck grid, sort dropdown, Copy button
- [ ] `CreateDeckPage.jsx` — two-column form (metadata left, card editor right), cover upload zone, Add Card button, inline card forms
- [ ] `DeckDetailPage.jsx` — hero banner, 2-tile mode launcher (Flashcard + Quiz), mastery progress card, card preview table
- [ ] `src/features/decks/components/DeckCard.jsx` — shadcn Card with cover icon, title, meta, badge, Study + Copy buttons
- [ ] `src/features/dashboard/components/ActivityChart.jsx` — Recharts BarChart, 7-day mock data
- [ ] `src/features/dashboard/components/StreakCard.jsx` — flame emoji + streak count
- [ ] `src/hooks/useDebounce.js` — debounce hook for search input (300ms)
- [ ] Mock deck data array in `src/features/decks/api/` (static JSON for frontend phase)

**Commit:** `feat(decks): dashboard, browse, create, and deck detail screens`

---

## 🟢 Sprint 4 — Study Modes
**Branch:** `feat/study`

- [ ] `StudyPage.jsx` — reads `?mode=` query param, renders FlashcardMode or QuizMode component
- [ ] `src/features/study/components/FlipCard.jsx` — CSS 3D flip on click + Spacebar, front/back faces
- [ ] Flashcard Mode — card counter, progress bar, Still Learning / Got It buttons, ← → keyboard shortcuts, completion summary
- [ ] `src/features/study/hooks/useFlashcardMode.js` — tracks known/stillLearning arrays, current card index
- [ ] Quiz Mode — 2×2 options grid, 30s countdown timer (yellow → red), score badge, green/red feedback, explanation panel, Next button
- [ ] `src/features/study/hooks/useQuizMode.js` — timer logic, score tracking, answer state
- [ ] `src/features/study/utils/generateQuizQuestions.js` — picks correct card + 3 distractors from mock deck, shuffles options
- [ ] Verify keyboard navigation works (Space = flip, ← = Still Learning, → = Got It)

**Commit:** `feat(study): flashcard mode and quiz mode with mock deck data`

---

## 🔵 Sprint 5 — Profile + Admin Screens
**Branch:** `feat/profile-admin`

- [ ] `ProfilePage.jsx` — shadcn Avatar with camera overlay, streak + mastery badges, 2-col stats, My Decks table, Study History table (mock sessions)
- [ ] `AdminDashboardPage.jsx` — dark sidebar, 3-col stats row, Recent Registrations table, Flagged Content list
- [ ] `AdminDecksPage.jsx` — search input, filter tabs (All / Public / Reported), deck table, reported row highlighted pink, Remove button with Dialog confirm
- [ ] `AdminUsersPage.jsx` — search input, filter tabs (All / Students / Creators / Suspended), user table with role badges, Promote / Suspend / Restore / Ban actions
- [ ] `src/components/layout/AdminSidebar.jsx` — persistent across all 3 admin screens

**Commit:** `feat(profile-admin): profile page and all admin panel screens`

---

## ⚪ Sprint 6 — Polish & Submit
**Branch:** `feat/polish` (or directly on `dev`)

- [ ] Responsive QA — all 13 screens at min 1024px width
- [ ] Verify all shadcn/ui components render correctly (Button variants, Badge colors, Dialog open/close)
- [ ] Check Tailwind v4 classes compile — no silent failures from v3 syntax
- [ ] Test Flashcard Mode keyboard shortcuts in Chrome + Firefox
- [ ] Check AdminRoute blocks non-admin users correctly
- [ ] Clean up `console.log` statements
- [ ] Update `CONTEXT.md` — mark all screens ✅ Done
- [ ] PR: `feat/polish` → `dev`
- [ ] PR: `dev` → `main`
- [ ] Tag release: `git tag v1.0.0-frontend && git push origin --tags`

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
