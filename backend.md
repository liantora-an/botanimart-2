# BotaniMart — Implementation Walkthrough

> **Status**: ✅ Backend + Frontend fully wired  
> **Build**: `next build` — 0 errors, 25 pages, 24 API routes, proxy active

---

## Architecture

```
Browser
  │
  ▼
src/proxy.ts ─── Session refresh + Route protection (Next.js 16)
  │
  ├── Public pages (/, /toko, /kegiatan) ─── AuthButton shows login/profile
  ├── Auth pages (/login, /register) ─── redirects away if authenticated
  ├── Protected pages (/keranjang, /checkout, /akun) ─── requires login
  ├── Admin pages (/admin) ─── requires login + admin role
  │
  ▼
src/app/api/**/route.ts ─── 24 endpoints
  │
  ▼
backend/controllers → services → repositories → Supabase
```

---

## Files Created/Modified

### Backend (38 files) — Complete
- Types, Config, Middlewares, Repositories (5), Services (6), Controllers (6)
- API Routes (19 files → 24 HTTP endpoints)
- SQL Migration, .env.example

### Frontend Wiring (10 files)

| File | Change |
|---|---|
| [LoginForm.tsx](file:///home/tora/Documents/botanimart-new/src/components/auth/LoginForm.tsx) | Mock → real `/api/auth/login` + redirect support |
| [RegisterForm.tsx](file:///home/tora/Documents/botanimart-new/src/components/auth/RegisterForm.tsx) | Mock → real `/api/auth/register` |
| [login/page.tsx](file:///home/tora/Documents/botanimart-new/src/app/(auth)/login/page.tsx) | Added `<Suspense>` for `useSearchParams` |
| [AuthButton.tsx](file:///home/tora/Documents/botanimart-new/src/components/layout/AuthButton.tsx) | **NEW** — Dynamic auth button with profile dropdown |
| [keranjang/page.tsx](file:///home/tora/Documents/botanimart-new/src/app/(user)/keranjang/page.tsx) | **NEW** — Cart page with real API |
| [checkout/page.tsx](file:///home/tora/Documents/botanimart-new/src/app/(user)/checkout/page.tsx) | **NEW** — Checkout + Midtrans Snap |
| [akun/page.tsx](file:///home/tora/Documents/botanimart-new/src/app/(user)/akun/page.tsx) | **NEW** — Account + order history |
| [page.tsx (home)](file:///home/tora/Documents/botanimart-new/src/app/page.tsx) | AuthButton + real cart API |
| [toko/page.tsx](file:///home/tora/Documents/botanimart-new/src/app/(user)/toko/page.tsx) | AuthButton + real cart API + /keranjang link |
| [kegiatan/page.tsx](file:///home/tora/Documents/botanimart-new/src/app/kegiatan/page.tsx) | AuthButton + /keranjang link |

### Infrastructure Fix
| File | Change |
|---|---|
| [src/proxy.ts](file:///home/tora/Documents/botanimart-new/src/proxy.ts) | Moved from root to `src/` (required for `src/` directory projects) |

---

## AuthButton Component

Dynamic, responsive navbar button that replaces all "Daftar/Login" links:

| State / Viewport | Displays |
|---|---|
| Loading | Spinner |
| Not logged in (Desktop) | "Daftar/Login" pill button → `/login` (with programmatic router fallback) |
| Not logged in (Mobile) | Sleek circular button with `User` icon → `/login` (with programmatic router fallback) |
| Logged in | Avatar + name + dropdown (Profil Akun, Admin Panel*, Keluar) |

*Admin Panel link shown only for Admin role users

---

## Cart Integration Summary

All "Tambah Keranjang" and "Beli Sekarang" buttons now:
1. Call `POST /api/cart` with real plant_id
2. If 401 → redirect to `/login?from=...`
3. If success → show confirmation (or redirect to `/checkout` for "Beli Sekarang")
4. Cart icon in navbar links to `/keranjang`

---

## Responsive & Clickable Header Layout Defenses

To ensure the "Daftar/Login" and "Shopping Cart" buttons are 100% responsive and clickable across all screen widths:
- **Responsive Logo Scaling:** Scaled the logo from a hardcoded `w-64 h-16` down to `w-44 h-11` on mobile, scaling up dynamically through breakpoints (`sm:w-52 md:w-60 lg:w-64`). This prevents horizontal overflow and item wrapping on compact screens.
- **Overlap Protection (`relative z-20`):** Added a higher stacking context and z-index to the `Right Action Icons` flex container on all pages. This guarantees that buttons are never covered by overlapping invisible boxes from the logo or navigation links.
- **Cache Cleaned:** Completely cleared the Next.js Turbopack build cache (`.next/`) to force an immediate, fresh delivery of the updated styling.

---

## Build Verification

```
✅ next build — 0 TypeScript errors
✅ 25 pages generated
✅ 24 API routes registered
✅ Proxy (Middleware) active
```

## Remaining (Low Priority)
- Refactor admin dashboard to use real API endpoints
- Extract shared Navbar/Footer components (DRY)
- Create Supabase Storage RLS policies
