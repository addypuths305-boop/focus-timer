# FocusTime — Study Break Timer ⏱️

FocusTime is a calm, student-focused productivity web application developed through a **Design-led Innovation process**. It is engineered to help students start studying without overwhelm, maintain focus for manageable periods, take restorative breaks, and celebrate steady progress without guilt or punitive mechanics.

---

## 🌟 Core Features & User Journey

1. **Low-Friction Habit Loop:**
   - **Choose a Task:** Set an optional micro-goal (e.g. *"Review biology notes"*, *"Complete two maths problems"*).
   - **Start Focus Session:** Choose from 15m, 30m, 45m, or 60m presets or custom durations.
   - **Segmented Display:** High-contrast, calm digital number cards inspired by tactile physical timers.
   - **Completion Chime:** Gentle, uplifting two-tone audio alert via the Web Audio API (no external asset downloads required).
   - **Restorative Break Mode:** 5-minute short breaks by default, automatically transitioning to a 15-minute long break after 4 completed study cycles, with gentle physical and mental rest suggestions (hydration, 20-20-20 eye rest, gentle stretches).
   - **Effort-First Progress Tracking:** Real session records, weekly totals, and chronological completed task log. Excludes breaks and abandoned sessions.

2. **Accurate & Drift-Proof Countdown:**
   - Recalculates remaining time from stored target timestamps (`targetEndTime`) rather than naive interval decrements, preventing browser tab throttling drift.
   - Preserves active timer state across browser refreshes and tab reopens via client-side storage.

3. **Secure Authentication & Cloud Sync:**
   - **Supabase Authentication:** Email & password authentication with email verification, password recovery, and Google OAuth support.
   - **PostgreSQL with Row Level Security (RLS):** Strict user data isolation ensuring students can only access and modify their own study sessions and profile.
   - **Zero-Friction Preview Mode:** If Supabase keys are not yet configured in `.env.local`, the application transparently runs in a local storage preview mode with clear setup instructions.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language:** TypeScript with strict type checking
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Authentication & Database:** [Supabase](https://supabase.com/) (PostgreSQL + RLS + GoTrue Auth)
- **Audio Synthesizer:** Native Web Audio API
- **Testing:** [Vitest](https://vitest.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📂 Project Structure

```text
focustime/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── callback/route.ts      # Supabase OAuth / email callback
│   │   │   ├── reset-password/page.tsx # Password recovery flow
│   │   │   └── page.tsx               # Login & Sign-up screen
│   │   ├── timer/page.tsx             # Main study timer screen
│   │   ├── profile/page.tsx           # Profile, history & progress
│   │   ├── globals.css                # Custom design tokens & theme
│   │   ├── layout.tsx                 # Root layout & typography
│   │   └── page.tsx                   # Auth state router
│   ├── components/
│   │   ├── auth/AuthForm.tsx          # Segmented sign-in/up form
│   │   ├── common/Header.tsx          # Brand header bar
│   │   ├── common/SetupNotice.tsx     # Supabase config indicator
│   │   ├── navigation/BottomNavigation.tsx # Mobile-first nav bar
│   │   ├── profile/
│   │   │   ├── CompletedSessionsList.tsx
│   │   │   ├── EditProfileModal.tsx
│   │   │   ├── ProfileHeader.tsx
│   │   │   └── ProgressSummary.tsx
│   │   └── timer/
│   │       ├── ContentPanel.tsx       # Intention & restorative tips
│   │       ├── DurationPresets.tsx    # 15m, 30m, 45m, 60m buttons
│   │       ├── SessionCompleteModal.tsx
│   │       ├── TaskInput.tsx
│   │       ├── TimerControls.tsx
│   │       └── TimerDisplay.tsx       # Segmented digits countdown
│   ├── lib/
│   │   ├── audio.ts                   # Gentle Web Audio chime
│   │   ├── notifications.ts           # Browser notifications helper
│   │   ├── timer-utils.ts             # Pure countdown & formatting logic
│   │   ├── timer-utils.test.ts        # Unit test suite
│   │   └── supabase/                  # Supabase clients & data access
│   └── types/index.ts                 # TypeScript interfaces
├── supabase/
│   └── migrations/
│       └── 20261029000000_init_focustime.sql # SQL migration with RLS
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+ or v22 LTS recommended)
- `pnpm` (or `npm`)

### 2. Installation
```bash
# Navigate to the project directory
cd focustime

# Install dependencies
pnpm install
```

### 3. Environment Setup (Optional for cloud sync)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note:** If `.env.local` is omitted, the app will run in local preview mode with full timer and profile functionality, persisting your sessions in browser storage.

### 4. Supabase Database Migration
To set up tables and security policies on Supabase:
1. Open the **SQL Editor** in your [Supabase Dashboard](https://supabase.com/dashboard).
2. Copy the contents of `supabase/migrations/20261029000000_init_focustime.sql`.
3. Run the script. This creates:
   - `profiles` table with automatic user creation trigger.
   - `study_sessions` table with status and duration constraints.
   - Row Level Security (RLS) policies for complete user data isolation.

### 5. Running the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the automated Vitest unit test suite:
```bash
pnpm test
```

Tests verify:
- Accurate `MM:SS` conversion.
- Segmented digit breakdown for digital display cards.
- Human duration formatting (e.g. `1 hr 15 min`).
- Session progress calculation percentage.
- Recommended break duration calculations (short break vs. 4-cycle long break).
- Deadline-based remaining time calculations against browser clock drift.

---

## 🚢 Building for Production & Vercel Deployment

### Local Production Build
```bash
pnpm build
pnpm start
```

### Deploying to Vercel
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), import your repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.
