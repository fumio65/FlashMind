# DECISIONS.md — FlashMind

> Log of key technical decisions. Prevents rehashing settled questions.

---

## D-01 — shadcn/ui over MUI or Chakra UI
**Decision:** Use shadcn/ui as the UI component library.
**Rationale:**
- Components are copy-pasted into the project — zero npm dependency lock-in
- Built on Radix UI (accessible, WAI-ARIA compliant) + Tailwind CSS v4
- Full ownership: modify any component without waiting for upstream fixes
- Matches the Tailwind-first workflow already committed to
- Industry standard in 2025/2026 — relevant to show in portfolio
**Rejected:** MUI (Material Design aesthetic conflicts with custom branding), Chakra UI (less Tailwind-native)

---

## D-02 — Zustand over Context API
**Decision:** Use Zustand for global state (auth token + user).
**Rationale:**
- Minimal boilerplate vs Context API + useReducer
- Built-in `persist` middleware handles localStorage sync automatically
- No Provider wrapping needed — access store directly in non-component files (e.g., Axios interceptor)
- Zustand 5.x is stable and widely adopted
**Rejected:** Context API (verbose for auth state), Redux Toolkit (overkill for this project scope)

---

## D-03 — React Hook Form + Zod over raw useState
**Decision:** All forms use React Hook Form with Zod schema validation.
**Rationale:**
- Prevents re-render on every keystroke (uncontrolled inputs by default)
- Zod gives runtime + TypeScript-compatible schema validation
- Error messages are co-located with the schema definition
- Works seamlessly with shadcn/ui Input components via `register()`
**Rejected:** raw `useState` per field (verbose, re-renders on every change), Formik (heavier API)

---

## D-04 — Feature-Based Architecture over Layer-Based
**Decision:** Organize frontend (and backend) by feature domain, not file type.
**Rationale:**
- Features are self-contained → easier to locate, modify, and delete code
- Pages stay thin (no logic) → simpler to test and read
- Scales to team environments — different devs own different features
- Industry standard (Bulletproof React pattern)
**Rejected:** Layer-based (`components/`, `hooks/`, `pages/`, `services/` at top level) — causes cross-feature coupling and distant file locations

---

## D-05 — Tailwind CSS v4 over v3
**Decision:** Use Tailwind CSS v4 with the `@tailwindcss/vite` plugin.
**Rationale:**
- v4 is the current stable release and default going forward
- Native Vite plugin eliminates PostCSS configuration overhead
- No `tailwind.config.js` needed for standard setups
- Future-proof choice aligned with the project's latest-version strategy
**Warning:** v4 setup is completely different from v3. Do NOT follow v3 tutorials. Setup: install `@tailwindcss/vite`, add `tailwindcss()` to Vite plugins, add `@import "tailwindcss"` to `index.css`. That's it.

---

## D-06 — Express.js 5 over Express 4
**Decision:** Use Express.js 5 (latest default on npm) for the backend.
**Rationale:**
- Now the default when running `npm install express`
- Native Promise support: rejected Promises in async routes are caught automatically — no try/catch boilerplate
- Updated `path-to-regexp` v8 fixes ReDoS (regex denial of service) vulnerability in route patterns
- Aligns with latest-stack principle of the project
**Key breaking change:** Some Express 4 route pattern syntax (e.g., optional parameters with `?`) is no longer valid. Review migration guide: https://expressjs.com/en/guide/migrating-5.html

---

## D-07 — Recharts over Chart.js
**Decision:** Use Recharts for the Weekly Activity bar chart on the Dashboard.
**Rationale:**
- React-native API (component-based) vs Chart.js imperative canvas API
- Easier to integrate with React state and props
- Lighter setup — no canvas ref management needed
- Sufficient for a single bar chart use case
**Rejected:** Chart.js (requires canvas ref + imperative initialization, more boilerplate in React)

---

## D-08 — MongoDB over PostgreSQL
**Decision:** Use MongoDB with Mongoose for the database.
**Rationale:**
- Flexible document schema suits flashcard content (cards can have optional image fields without schema migration)
- Deck-Card relationship (embedded vs referenced) is more natural in MongoDB
- Mongoose 8 provides sufficient schema enforcement and validation
- Instructor requirement context
**Trade-off:** Relational integrity (e.g., cascading deletes) must be handled manually in controllers

---

## D-09 — JWT in localStorage over HttpOnly Cookies
**Decision:** Store JWT in Zustand store (persisted to localStorage).
**Rationale:**
- Simpler implementation for academic project scope
- Zustand persist middleware handles sync automatically
- Axios interceptor reads the token directly from the store
**Trade-off:** localStorage is vulnerable to XSS. For production hardening, migrate to HttpOnly cookies + CSRF tokens. Acceptable for academic scope.

---

## D-10 — Mock Data Pattern for Frontend Phase
**Decision:** During the frontend (midterm) phase, API modules (`*.api.js`) return mock data via `Promise.resolve()`.
**Rationale:**
- Allows full frontend development and testing without a running backend
- The swap to real API calls in Phase B only requires changing the API module implementations — no component or hook changes needed
- Keeps concerns cleanly separated
**Implementation:** Each `*.api.js` file exports the same function signatures as the real API. The mock implementation just wraps static JSON in a resolved Promise.
