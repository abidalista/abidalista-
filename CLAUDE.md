# CLAUDE.md — Rules of Engagement

## Product Vision: Professional SaaS Utility

- **Aesthetic Anchor:** "Soft Enterprise."
- **Core Philosophy:** Sophisticated, airy, and high-trust. Avoid "techy" black/neon; use "clean" white/indigo/slate.

## Design System (The "Surfe" Look)

### Typography
- **Primary:** Plus Jakarta Sans or Inter.
- **Scale:** Large H1s (`text-5xl` to `text-6xl`) with tight letter spacing (`tracking-tight`).

### Color Palette
- **Backgrounds:** Pure White (`#FFFFFF`) and ultra-light Gray/Indigo (`#F9FAFB` or `#F5F7FF`).
- **Primary Action:** Surfe Indigo (`#6366F1`) or Deep Blue (`#0F172A`).
- **Accents:** Soft gradients (Indigo to Violet) used sparingly on icons/small badges.

### UI Components
- **The "Bento" Grid:** Everything lives in cards. Use `bg-white`, `border border-slate-100`, and `rounded-[24px]` (24px radius).
- **Soft Shadows:** Use `shadow-sm` or custom `0 10px 15px -3px rgba(0, 0, 0, 0.03)`. No heavy shadows.
- **Buttons:** `rounded-full` (pill shape). Primary buttons are solid; secondary are ghost/outline with subtle hover lifts.

### Interactions
- Use `framer-motion`. Everything should "float" in with `y: 20` offset and `duration: 0.5`.

## Engineering & Logic (The "Functional" Rule)

### Architecture
- UI components in `@/components/ui`.
- External library logic must be isolated in `@/lib/services/`. Do not mix raw library code with React components.

### Verification
- Before finishing a feature, Claude must write a `test-integration.ts` script to prove the GitHub library is returning valid data.

### State
- Use **Lucide React** for icons. Keep them thin (`stroke-width: 1.5`).

## UX Copy & Tone

### Voice
"The High-Performance Assistant." Smart, brief, and helpful.

### Constraint: No "AI fluff."
- **Bad:** "Our powerful AI-driven platform helps you manage subscriptions easily."
- **Surfe-style:** "Stop the drain. Cancel any subscription in two clicks."

### Hierarchy
- **H1** = Big Benefit.
- **Sub-text** = How it works.
- **Button** = Clear Action.

## Workflow Requirements

1. **Browser Check:** After layout changes, use `claude --chrome` to verify spacing matches the "Surfe" airiness.
2. **Logic First:** Fix the tool's backend logic before polishing the button colors.
3. **Atomic Commits:** Commit every functional milestone (e.g., `feat: integrate cancellation library`).
