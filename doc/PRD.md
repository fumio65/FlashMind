# PRD.md — FlashMind

## Core Objective
A web-based smart flashcard study platform for Filipino university students to create, share, and study flashcard decks using two interactive study modes.

## Key Features
| Feature | Description |
|---|---|
| Auth | JWT login/register, bcrypt passwords, role-based access (student / creator / admin) |
| Decks | Full CRUD — create, edit, delete, copy public decks; cover image upload |
| Cards | Inline card editor — front/back text + optional image per face |
| Flashcard Mode | CSS 3D flip card — Known ✓ / Still Learning ✗ marking, keyboard shortcuts |
| Quiz Mode | Auto-generated MCQ, 30s countdown timer, instant color feedback |
| Dashboard | Study streak, cards mastered, weekly activity Recharts bar chart |
| Browse | Search + category filter (All / Math / Science / IT / History / Filipino), sort options |
| Profile | Avatar upload, deck list, session history table |
| Admin | Stats overview, deck moderation (report/remove), user management (promote/suspend/ban) |
| File Uploads | Profile photo, deck cover, card images — Multer → Cloudinary, max 5MB |

## User Roles
- **Guest** — browse & view public decks only
- **Student** — full study features, create decks, copy public decks
- **Creator** — same as Student; publishes public decks to the community
- **Admin** — full access to admin panel (moderation + user management)

## Success Metrics
- All 13 wireframe screens rendered and navigable
- Flashcard flip animation + keyboard shortcuts working
- Quiz timer counts down and auto-advances on expiry
- Forms validate via Zod before submission
- Admin panel restricted to admin role only

## Constraints
- **Midterm** — Frontend only (React 19 + Vite 8 + Tailwind v4 + shadcn/ui), mock data
- **Final** — Backend integration (Express 5 + MongoDB 6 + Cloudinary)
- File uploads max 5MB (Cloudinary free tier)
- Web-only — no mobile app
- Node.js 22 LTS required (Vite 8 requires 20.19+)
