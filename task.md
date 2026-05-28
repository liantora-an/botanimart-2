# BotaniMart — Implementation Task Tracker

## Decisions Locked

- ✅ Cart requires login (no guest cart)
- ✅ Order status (processing → shipped → completed) managed manually by Admin
- ✅ Categories managed via admin panel (DB table, not hardcoded)
- ✅ Midtrans Sandbox for dev, IS_PRODUCTION based on env var
- ✅ SUPABASE_SERVICE_ROLE_KEY used only in server-side route handlers
- ✅ Robust Self-Healing Session/Profile Sync (automatically recreates public.users if deleted from auth.users)

---

## Phase 1 — Foundation ✅

- [x] Core types, middlewares, repositories, proxy, migration, .env.example

## Phase 2 — Core Services & API ✅

- [x] All 6 services, 6 controllers, 24 API route handlers

## Phase 3 — Frontend Pages ✅

- [x] Cart page (`/keranjang`) — real API
- [x] Checkout page (`/checkout`) — Midtrans Snap
- [x] Account page (`/akun`) — orders + profile

## Phase 4 — Frontend Wiring ✅

- [x] Wire `LoginForm.tsx` → real `/api/auth/login`
- [x] Wire `RegisterForm.tsx` → real `/api/auth/register`
- [x] Fix `proxy.ts` location (`src/proxy.ts` for `src/` directory)
- [x] Fix Suspense boundary for `useSearchParams` on login page
- [x] Create `AuthButton` component (profile dropdown + logout)
- [x] Make AuthButton responsive for mobile (sleek circular user button) and add programmatic routing fallback for high navigation reliability
- [x] Implement responsive logo scaling and relative z-index overlap protection for headers on all user pages
- [x] Replace Daftar/Login in homepage navbar → `<AuthButton />`
- [x] Replace Daftar/Login in toko navbar → `<AuthButton />`
- [x] Replace Daftar/Login in kegiatan navbar → `<AuthButton />`
- [x] Wire homepage add-to-cart + buy-now → real `/api/cart`
- [x] Wire toko page add-to-cart + buy-now → real `/api/cart`
- [x] Wire toko navbar cart icon → `/keranjang` link
- [x] Wire kegiatan navbar cart icon → `/keranjang` link
- [x] ✅ Build compiles cleanly (0 errors, proxy active)

## Phase 5 — Remaining (Low Priority)

- [ ] Refactor admin dashboard to use real API endpoints
- [ ] Create Supabase Storage bucket policies (RLS)
- [x] Extract shared Navbar component (DRY all pages)
- [x] Extract shared Footer component
