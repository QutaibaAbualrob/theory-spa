# automataverse.com — Reference Summary

**Site:** https://www.automataverse.com
**Repo:** https://github.com/robinsingh-ai/Automata-Simulator (landing page only, no simulation code)

## Overview

AutomataVerse is a **production-level** interactive automata simulator built for students and educators. It supports DFA, NFA, DPDA, NPDA, Turing Machines, Mealy, and Moore machines. The live app has cloud features (save/share), user profiles, and a polished UI — well beyond MVP scope, but useful as a reference for UX patterns and feature set.

## UI Layout

```
┌─────────────────────────────────────────────┐
│  Header: ☀️ theme | [DFA 1 ▼] | + | Groups | Profile │
├─────────────────┬───────────────────────────┤
│                 │                           │
│  Control Panel  │     Canvas (diagram)       │
│  ─────────────  │                           │
│  File Ops       │    (state graph,           │
│   Open / Save   │     drag/pan/zoom,         │
│  ─────────────  │     JointJS-based)         │
│  State Controls │                           │
│   Add New State │                           │
│  ─────────────  │                           │
│  Input String   │                           │
│  [___________]  │                           │
│  [Run]  [Step]  │                           │
└─────────────────┴───────────────────────────┘
```

**Key observations:**
- Canvas is the primary surface (JointJS), sidebar is secondary
- The input box + Run/Step are at the **bottom** of the sidebar — not a separate control bar
- Multiple machines managed via a dropdown ("DFA 1") + "+" tab
- Theme toggle present
- Guide panel slides out with keyboard shortcuts + help

## Key UX Patterns Used

| Pattern | Notes |
|---------|-------|
| **Drag-to-create states** | Double-click canvas → new state |
| **Click-to-create transitions** | Click state A, then state B |
| **Canvas pan/zoom** | Drag empty space, scroll to zoom |
| **Right-click actions** | Set as start, toggle accepting |
| **Inline label editing** | Double-click transition label to edit |
| **Step-by-step execution** | Step button highlights current state/transition |
| **Theme toggle** | ☀️ button in header |
| **Example machines** | Loadable via Open → built-in examples |

## Interaction Model

- **Add transition:** Click source state → click target state → modal for label
- **Self-loop:** Click same state twice
- **Delete state:** Select → Delete key
- **Delete transition:** Cmd/Ctrl + click on transition
- **Reset view:** Command palette → Reset View
- **Command palette:** Cmd/Ctrl + \

## Tech Stack (inferred from code structure)

- Backend: Next.js or similar (has pages router, cloud save, auth)
- Diagram library: JointJS (declared in the open-source companion repo)
- Frontend: React (likely, given the SPA behavior)
- State management: Redux or similar (has cloud sync)

## Features Relevant to Our MVP

- **Step-by-step execution** — essential for learning
- **State highlighting** — active states glow/change color
- **Transition labels** — always visible on edges
- **Start arrow marker** → state circle
- **Accept state double border** (standard convention)
- **Dark/light theme** — nice touch

## Features OUT of MVP Scope

- User accounts / auth
- Cloud save / share links
- Multiple machine instances (tabs)
- Drag-to-create state editing
- Right-click context menus
- Command palette
- Mealy/Moore machines
- Image export

## Presets/Examples Strategy

AutomataVerse uses a file-based "Open" system where users load from built-in examples. Our MVP can simplify this to a dropdown or button list that directly loads preset machine definitions.
