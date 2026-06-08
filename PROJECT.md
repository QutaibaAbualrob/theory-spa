# TOC Visual Lab — Agent Reference

> Complete project snapshot for AI agents. Read this before making changes.
> If you're an agent picking up this project, start here — not from scratch.

## Overview

A browser-based React SPA for interactive automata learning. Built with React 19 + Vite 8, fully client-side. Desktop-only, light theme. No backend, no auth, no database, no extra runtime dependencies.

## Quick Start

```bash
cd E:\theory\theory-spa
npm install        # first time
npm run dev        # dev server at localhost:5173
npm run build      # prod build → dist/ (45 modules, ~200ms, 0 errors)
```

## Project Structure

```
src/
  App.jsx              ← tab routing, imports all 5 module views
  main.jsx
  index.css            ← imports globals.css + layout.css
  styles/
    globals.css        ← CSS vars, resets, utility classes
    layout.css         ← 3-panel grid, header, tabs, buttons, control bar
  components/
    Header.jsx         ← Logo + subtitle
    TopTabs.jsx        ← DFA | NFA | PDA | TM Addition | GNFA
    MachineCanvas.jsx  ← SVG state graph (nodes, edges, self-loops, dynamic viewBox)
    TracePanel.jsx     ← 3-column grid (Step | Symbol | State(s)), no fixed height
    ResultBadge.jsx    ← Accept / Reject / Ready pill
    TheoryPanel.jsx    ← Concept text block
    PresetSelector.jsx ← Buttons to load preset machines
    StackView.jsx      ← PDA stack (vertical cells, top highlighted)
    TapeView.jsx       ← TM tape (horizontal cells, head arrow indicator)
  modules/
    dfa/   DFAView.jsx, dfaEngine.js, dfaPresets.js, dfaTheory.js
    nfa/   NFAView.jsx, nfaEngine.js, nfaPresets.js, nfaTheory.js
    pda/   PDAView.jsx, pdaEngine.js, pdaPresets.js, pdaTheory.js
    tm/    TMView.jsx, tmEngine.js, tmPresets.js, tmTheory.js
    gnfa/  GNFAView.jsx, gnfaPresets.js, gnfaTheory.js
  utils/
    graphLayout.js     ← layoutCircular(), layoutLinear(), perpOffset()
ref/                   ← Reference summaries (read-only)
PROJECT.md             ← This file (agent reference)
README.md              ← User-facing project README
```

## Component Dependency Graph

```
App.jsx
  ├── Header.jsx           (pure presentational, no props)
  ├── TopTabs.jsx          (props: tabs[], activeTab, onTabChange)
  ├── DFAView ← NFAView ← PDAView ← TMView ← GNFAView
  │     (only ONE rendered at a time via activeTab conditional)
  │
  │     Each View renders:
  │       ├── TheoryPanel.jsx       (props: theory, preset)
  │       ├── MachineCanvas.jsx     (props: machine, activeStates, activeTransition)
  │       │                          Used by DFA/NFA/PDA/GNFA (not TM)
  │       ├── TracePanel.jsx        (props: steps, accepted, currentStepIndex)
  │       ├── ResultBadge.jsx       (props: accepted)
  │       ├── StackView.jsx         (props: stack) — PDA only
  │       ├── TapeView.jsx          (props: tape, head) — TM only
  │       └── <div.control-bar>     (inline in each view, identical pattern)
```

All modules share the same component set — no module has a unique component that another doesn't share (except StackView for PDA, TapeView for TM).

## Architecture Pattern (all modules follow this)

- Each module is a self-contained `useReducer` + fragment with 4 children:
  ```
  <div className="left-panel"> + <div className="center-panel"> + <div className="right-panel"> + <div className="control-bar" style={{gridColumn: '1 / -1'}}>
  ```
- Same reducer action types everywhere: `LOAD_PRESET`, `SET_INPUT`, `RUN_DONE`, `STEP_INIT`, `STEP_ADVANCE`, `RESET`
- No global state management — each module owns everything
- All 5 views are conditionally rendered in App.jsx (only one mounted at a time)

### State / Reducer Pattern

```js
const initialState = {
  machine: null,
  input: '',
  trace: [],
  currentStepIndex: 0,
  accepted: null,
  error: null,
  running: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_PRESET': return { ...initialState, machine: action.preset, input: action.preset.sampleInputs[0] };
    case 'SET_INPUT': return { ...state, input: action.value };
    case 'RUN_DONE': return { ...state, trace: action.trace, accepted: action.accepted, error: action.error, currentStepIndex: action.lastStep, running: false };
    case 'STEP_INIT': return { ...state, trace: action.trace, error: action.error, currentStepIndex: 0, running: false, accepted: null };
    case 'STEP_ADVANCE': return { ...state, currentStepIndex: action.index, accepted: action.index === action.lastStep ? action.result : null };
    case 'RESET': return { ...state, currentStepIndex: 0, accepted: null, error: null };
    default: return state;
  }
}
```

## Data Model

```js
{
  id: "unique-id",
  type: "dfa",          // "nfa", "pda", "tm", "gnfa"
  title: "...",
  description: "...",
  states: [{ id, label, start, accept, x, y }],
  alphabet: [...],
  transitions: [{ from, to, symbol }],   // PDA adds: pop, push, read; TM adds: write, move
  sampleInputs: [...],
  stackStart: "Z",       // PDA only
  transitionTable: [...]  // TM only
}
```

### Step shapes

| Module | Step | Notes |
|--------|------|-------|
| DFA | `{ index, symbol, currentState }` | Single state |
| NFA | `{ index, symbol, currentStates }` | Array — multiple active states |
| PDA | `{ index, symbol, state, stack, action }` | Has `currentState` alias for TM display |
| TM | `{ index, tape, head, state, action }` | tape is array of symbols |
| GNFA | (read-only, no engine) | — |

## Engine API Contract

```js
simulateDFA(machine, input) → { accepted, steps, error? }
simulateNFA(machine, input) → { accepted, steps, error? }
simulatePDA(machine, input) → { accepted, steps, error? }
simulateTM(machine, input)  → { accepted, steps, error? }
```

GNFA has no engine — it's a read-only concept page with 4 elimination step cards.

## MachineCanvas — SVG State Graph

Key rendering details:
- **Circles**: r=28 (main), r=35 (accept double border)
- **Start arrow**: line from `(x-60, y)` to `(x-36, y)` with arrowhead
- **Self-loop**: cubic bezier arc above the node (text at y-65)
- **Edges**: quadratic bezier with `perpOffset` for curve
- **Dynamic viewBox**: computed from state positions with 60px padding
- **Minimum viewBox**: clamped to 400×300 (so single nodes don't blow up)
- **Highlighting**: `activeStates` (array of state IDs to glow), `activeTransition` (single `{from, to}` OR array of pairs for NFA)

### Transition Highlighting

`activeTransition` accepts two formats (backward compatible):
- Single object: `{ from: "q0", to: "q1" }` (DFA)
- Array: `[{ from: "q0", to: "q1" }, { from: "q0", to: "q2" }]` (NFA)

Computed in views via trace step comparison.

## Component Interaction Details & Breakage Risks

### App.jsx
- **Props it passes**: none to views (they self-contain). Only TopTabs gets `tabs`, `activeTab`, `onTabChange`.
- **What breaks if changed**: changing the conditionally rendered module views (`activeTab === 'DFA' && <DFAView />`) would break tab switching. Adding a new tab requires a new module with the 4-child fragment pattern.

### Header.jsx
- **Props received**: none.
- **What breaks**: purely cosmetic. Safe to modify.

### TopTabs.jsx
- **Props received**: `tabs[]`, `activeTab`, `onTabChange`.
- **What breaks**: changing the tab list array in App.jsx would break which views render. Adding/removing a tab here requires adding/removing a condition in App.jsx AND the module files.

### MachineCanvas.jsx
- **Props**: `machine`, `activeStates[]`, `activeTransition` (object or array).
- **Used by**: DFAView, NFAView, PDAView, GNFAView (NOT TMView — TM uses its own center panel with TapeView).
- **What breaks if you change the prop interface**: ALL four views that use it would need updating. The `activeTransition` dual-format (single object vs array) is specifically for NFA — if you change it, update NFAView's computation AND DFAView's. The SVG rendering math (bezier curves, circle radii, arrow positions) is tightly coupled to the preset node coordinates — changing r=28 or start arrow offset x-60 requires updating preset coordinates too. The viewBox minimum clamp (400×300) is critical for single-node presets (PDA Balanced Parentheses).

### TracePanel.jsx
- **Props**: `steps[]`, `accepted`, `currentStepIndex`.
- **Used by**: ALL 5 modules.
- **What breaks**: step shape differs per module (DFA has `currentState`, NFA has `currentStates[]`, PDA has `state`+`stack`+`action`, TM has `tape`+`head`+`state`+`action`). The component reads `step.currentStates || step.currentState` (line 40-42). If you add fields to step shapes, make sure TracePanel displays them. Currently PDA's `action` field is generated but NOT displayed.

### ResultBadge.jsx
- **Props**: `accepted` (true | false | null).
- **Used by**: ALL 5 modules.
- **What breaks**: trivial display component. Safe to modify.

### TheoryPanel.jsx
- **Props**: `theory`, `preset`.
- **Used by**: ALL 5 modules.
- **What breaks**: expects theory object with sections. If you restructure theory content, update theory files in each module.

### PresetSelector.jsx
- **Props**: `presets[]`, `currentPresetId`, `onSelect`.
- **Used by**: ALL 5 modules.
- **What breaks**: buttons rendered from presets array. Add/remove presets freely.

### StackView.jsx
- **Props**: `stack[]`.
- **Used by**: PDAView only.
- **What breaks**: `null`/`undefined` vs `[]` distinction (shows placeholder vs "[ empty ]"). If you change the step shape for PDA stack, update here.

### TapeView.jsx
- **Props**: `tape[]`, `head` (number).
- **Used by**: TMView only (in center panel, replacing MachineCanvas).
- **What breaks**: head indicator positioning uses `paddingLeft: head * 38`. If tape cell width changes, update this offset.

## CSS Layout Dependencies

### layout.css

- **`.main-content`** grid: if you change `grid-template-columns`, ALL panels resize. Currently 260px 1fr 280px.
- **`.right-panel` sticky**: `max-height: calc(100vh - 160px)` depends on header(56)+tabs(40)+control-bar(56)+padding(32-16). If header/tab/control-bar heights change, update this calc.
- **`.control-bar` sticky**: `bottom: 0` with `z-index: 10` keeps it above scrollable content. Remove sticky and the user loses bottom-chrome visibility.
- **`.center-panel`**: `display: flex; align-items: center; justify-content: center` centers the SVG. If you change this, SVG centering breaks.

### globals.css

- **CSS vars**: `--accent` (#4361ee) is used by MachineCanvas for highlighted edges and active state glow. Changing it changes the entire visual theme.
- **`:root` font vars**: all text uses these. Safe to change.

## Change Log

### 2026-06-08 — viewBox minimum clamp + NFA transition highlighting

| File | Change |
|------|--------|
| `src/components/MachineCanvas.jsx` | Added minimum viewBox clamp (400×300). When states are few/clustered, the viewBox doesn't shrink below this, preventing single-node graphs from blowing up to fill the panel. |
| `src/components/MachineCanvas.jsx` | Changed `isActive` check to accept either a single `{from, to}` object (DFA) or an array (NFA) — backward compatible. |
| `src/modules/nfa/NFAView.jsx` | Replaced `const activeTransition = null` with computation that finds all `{from, to}` pairs matching the current symbol between consecutive trace steps. NFA edges now highlight during stepping. |

### 2026-06-08 — PDA edge labels (MachineCanvas handles `read, pop → push` format)

| File | Change |
|------|--------|
| `src/components/MachineCanvas.jsx` | Edge label generator now checks for `t.read !== undefined` (PDA format) and renders `read, pop → push`. Falls through to `t.symbol` for DFA/NFA. |

**Bug:** PDA transitions use `{ read, pop, push }` instead of `{ symbol }`. MachineCanvas was reading `t.symbol` which is undefined for PDA → edge labels were blank.

### 2026-06-08 — stale trace fix (SET_INPUT clears simulation state)

| File | Change |
|------|--------|
| `src/modules/dfa/DFAView.jsx` | SET_INPUT reducer case now also clears `trace`, `currentStepIndex`, `accepted`, `error` |
| `src/modules/nfa/NFAView.jsx` | Same fix |
| `src/modules/pda/PDAView.jsx` | Same fix |
| `src/modules/tm/TMView.jsx` | Same fix |

**Bug:** Changing the input after running left the old trace in state. Clicking Step would use the stale trace length for `lastStep`, causing premature "Accepted" display. Also the trace panel showed the old run's steps, not matching the current input.

**Fix:** The `SET_INPUT` action in each reducer now atomically resets `trace: [], currentStepIndex: 0, accepted: null, error: null` alongside the new input value. GNFA had no SET_INPUT case (read-only module) so it was unaffected.

### 2026-06-08 — layout sticky chrome

| File | Change |
|------|--------|
| `src/styles/layout.css` | Changed `.main-content` to scrollable (`overflow-y: auto`), added `grid-template-rows: 1fr auto` for control bar row. |
| `src/styles/layout.css` | Made `.right-panel` sticky with `position: sticky; top: 16px; align-self: start; max-height: calc(100vh - 160px); overflow-y: auto;` |
| `src/styles/layout.css` | Made `.control-bar` sticky: `position: sticky; bottom: 0; z-index: 10;` |
| `src/styles/globals.css` | Added `max-height: 100vh; overflow: hidden` to `.app-container` to prevent overscroll. |

### Earlier (before this reference file)

| File | Change |
|------|--------|
| `src/components/MachineCanvas.jsx` | Self-loop arrows switched from quadratic to cubic bezier (arrowhead points INTO circle). |
| `src/components/MachineCanvas.jsx` | Dynamic viewBox computed from state positions (replaced hardcoded "0 0 500 400"). |
| `src/components/TracePanel.jsx` | Removed fixed max-height — parent panel handles scrolling. |
| `src/modules/pda/pdaEngine.js` | PDA acceptance requires empty stack in addition to final state. |
| `src/modules/pda/pdaEngine.js` | Added `currentState` alias to PDA steps for TracePanel display. |
| `src/components/StackView.jsx` | Distinguishes null/undefined (placeholder) from empty [] ("[ empty ]"). |
| `README.md` | Rewritten. Mobile CSS removed. Dead scaffold files removed. Unused ControlBar.jsx deleted. |

## Known Issues & Quirks

### NFA visual noise (future fix planned)
NFA simulation tracks all possible paths, so multiple states glow concurrently. For "Contains 01" on "01": final step shows `[q0, q2]` because q0 is still reachable via self-loop. This is technically correct but visually noisy on complex inputs like "ababab" where 3 states light up.

**Planned fix (not yet implemented):**
- Track which states were freshly entered by a transition in the current step vs carried over from previous steps via self-loops
- Apply a dimmer glow / lower opacity for carried-over states
- Full bright glow for states reached by a non-self-loop transition
- This would keep correctness while making the visual much cleaner — q0 would be dim, q1/q2/q3 would pop

### PDA acceptance requires empty stack
PDA accepts only if final state is accept AND stack is empty. This prevents false accepts on "(()" and "aab".

### PDA trace action column not displayed
Engine generates an `action` string per step but it's not rendered in TracePanel UI. Only `state` and `symbol` show.

### GNFA read-only
Elimination step cards are educational static text. They don't update the graph when clicked (intentional for MVP).

### No keyboard shortcuts
No Enter-to-run, no arrow-key stepping. Minor UX polish.

### Edge case: empty input
DFA/NFA/PDA accept/reject on empty string depends on start state being accept. Works correctly but untested for TM.

### viewBox minimum clamp
MachineCanvas enforces minimum 400×300 viewBox to prevent single-node graphs from filling the entire panel. The center panel centers the SVG via flexbox.

### PDA step re-calculates on every Step click
In PDAView, `handleStep` re-runs `simulatePDA` on every click (line 144), even when just advancing the index. Same pattern in other views. Inefficient but harmless for current preset sizes.

## Conventions for Agents

1. **All module views follow the same reducer pattern** — if fixing one, check if others need the same fix
2. **CSS changes only** when possible (layout.css, globals.css)
3. **Pure CSS for sticky/scroll** — no JS scroll handlers
4. **Backward compatible prop changes** — when changing MachineCanvas props, keep old format working
5. **Build must pass** — `npm run build` should produce 45 modules, 0 errors
6. **Dual-format props** — if a feature only applies to some modules (like NFA's multi-transition), use a backward-compatible format (single object OR array) rather than breaking existing consumers
7. **Check all 5 modules** when changing shared components or CSS — a change that works for DFA might break GNFA's layout
