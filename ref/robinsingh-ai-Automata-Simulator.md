# robinsingh-ai/Automata-Simulator — Reference Summary

**Repo:** https://github.com/robinsingh-ai/Automata-Simulator
**Source:** Landing page / marketing README only — no simulation code
**Live app:** https://www.automataverse.com (separate codebase)

## What This Repo Is

This repository contains **only a README.md** that describes the AutomataVerse platform. It has no simulation engine code, no frontend components, and no build files. It's essentially the marketing page for the AutomataVerse project.

## What the README Tells Us

### Supported Automata Types
- **DFA** — "Visualize and simulate DFAs with step-by-step execution"
- **NFA** — "Experiment with multiple possible state transitions"  
- **PDA** — "Stack-based computation with visual stack representation"
- **Turing Machine** — "Multi-tape support and intuitive tape visualization"
- **Moore & Mealy machines** — "With output visualization"

### Feature Categories
| Category | Features |
|----------|----------|
| **Cloud** | Save machines to cloud, shareable links, JSON import/export |
| **Interactive Testing** | Custom input strings, real-time state transitions, step-by-step |
| **User Profiles** | Auth, saved machines, personal dashboard |

### Tech Stack (inferred from npm dependencies)
The attached package.json reveals:
- TypeScript
- Next.js framework
- Tailwind CSS
- Prisma ORM (PostgreSQL)
- NextAuth.js
- UploadThing (file uploads)
- Various UI libraries (cmdk, vaul, sonner, tailwind-merge, etc.)

This is a **full-stack Next.js application** — very different from our client-only MVP.

## Useful Insights for Our MVP

Even though this repo has no code, the marketing copy validates our feature priorities:

1. **Step-by-step execution is the #1 selling point** — listed first for DFA
2. **Multiple active states** — the distinguishing NFA feature
3. **Stack visualization** — the key PDA learning aid
4. **Tape visualization** — essential for TM understanding
5. **No installation** — "Works in Browser" is a headline feature

## What We Should NOT Do

- No cloud saves (MVP scope: client-only)
- No user auth/profile system
- No multi-tape TM (single tape is complex enough)
- No Next.js backend (pure Vite SPA)
- No Prisma/PostgreSQL (zero backend dependencies)

## Bottom Line

Treat this repo as a **product requirements validator** rather than a code reference. The feature list confirms the spec is on the right track. The actual implementation patterns are in the AleKiller21 repo.
