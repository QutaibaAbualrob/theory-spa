# TOC Visual Lab

**A browser-based automata learning SPA** — interactive visual simulations of DFA, NFA, PDA, Turing Machine (binary addition), and GNFA.

Built with React 19 + Vite. Fully client-side. No backend, no auth, no database.

---

## MVP Scope

| Module | Status | Engine | Visualization |
|--------|--------|--------|---------------|
| DFA | ✓ Required | Single-state step simulation | State graph (SVG), active highlight |
| NFA | ✓ Required | Multi-state + epsilon closure | State graph, multiple highlights |
| PDA | ✓ Required | Stack push/pop step simulation | State graph + StackView panel |
| TM Addition | ✓ Required | Tape read/write/move simulation | TapeView (horizontal cells) |
| GNFA | ✓ Simplified | Regex-labeled graph (read-only) | State graph, no elimination UI |

**Out of MVP:** user accounts, backend APIs, cloud save, full TM authoring, GNFA state elimination UI, multi-user sharing.

---

## Layout

```
┌──────────────────────────────────────────────────┐
│  Header: title, subtitle                         │
├──────────────────────────────────────────────────┤
│  [DFA] [NFA] [PDA] [TM Addition] [GNFA]         │
├──────────────┬───────────────────┬───────────────┤
│ Left Panel   │  Center Panel     │ Right Panel   │
│ Theory text  │  State graph OR   │ Trace steps   │
│ Preset list  │  TM tape view     │ Current state │
│ Machine info │                   │ Stack / Tape  │
│              │                   │ Result badge  │
├──────────────┴───────────────────┴───────────────┤
│  [input field] [Run] [Step] [Reset] [Load Ex.]   │
└──────────────────────────────────────────────────┘
```

**Mobile:** panels stack vertically: controls → visualization → trace → theory.

---

## Data Model

```js
// Base machine schema
{
  id: "dfa-even-ones",
  type: "dfa",
  title: "Even number of 1s",
  description: "Accepts binary strings with an even count of 1.",
  states: [
    { id: "q0", label: "q0", start: true, accept: true, x: 120, y: 160 },
    { id: "q1", label: "q1", start: false, accept: false, x: 320, y: 160 }
  ],
  alphabet: ["0", "1"],
  transitions: [
    { from: "q0", to: "q0", symbol: "0" },
    { from: "q0", to: "q1", symbol: "1" },
    { from: "q1", to: "q1", symbol: "0" },
    { from: "q1", to: "q0", symbol: "1" }
  ]
}
```

### Extensions per module

- **NFA:** transitions may have `symbol: "ε"`; `to` is always a single state ID (nondeterminism via multiple transitions from same state+symbol)
- **PDA:** transitions add `pop`, `push` fields (stack operations)
- **TM:** transitions add `write`, `move` fields (tape operations)
- **GNFA:** transitions use `symbol` as regex string (e.g., `"a|b"`, `"a*"`)

---

## Presets

### DFA
1. **Even number of 1s** — 2 states, binary alphabet
2. **Ends with 01** — 3 states, binary alphabet

### NFA
1. **Contains substring "01"** — 3 states
2. **Ends with "ab" or "ba"** — 4 states

### PDA
1. **Balanced parentheses** — stack tracks nesting
2. **aⁿbⁿ** — push a, pop b

### TM Addition
1. `1+1` → `10`
2. `10+1` → `11`
3. `101+11` → `1000`

### GNFA
1. Simple 3-state regex-labeled machine (read-only concept page)

---

## File Structure

```
src/
  main.jsx
  App.jsx
  index.css
  styles/
    globals.css          # CSS variables, resets, typography
    layout.css           # 3-panel grid, responsive breakpoints
    panels.css           # Theory, trace, stack, tape styles
    visualization.css    # SVG state graph, active states, transitions
  components/
    Header.jsx           # Title, subtitle
    TopTabs.jsx          # Tab bar (DFA/NFA/PDA/TM/GNFA)
    TheoryPanel.jsx      # Left panel: concept text + presets
    PresetSelector.jsx   # Dropdown/button list of presets
    ControlBar.jsx       # Input field, Run, Step, Reset, Load Example
    MachineCanvas.jsx    # SVG state graph (all graph-based machines)
    TracePanel.jsx       # Right panel: execution trace rows
    ResultBadge.jsx      # Green/red accepted/rejected indicator
    StackView.jsx        # PDA stack visualization
    TapeView.jsx         # TM tape cells with head indicator
  utils/
    graphLayout.js       # Circular/linear node positioning
  modules/
    dfa/
      DFAView.jsx        # Wires DFA engine + presets + canvas
      dfaEngine.js       # simulateDFA(), validateDFA()
      dfaPresets.js      # Preset machine definitions
      dfaTheory.js       # Concept text strings
    nfa/
      NFAView.jsx
      nfaEngine.js
      nfaPresets.js
      nfaTheory.js
    pda/
      PDAView.jsx
      pdaEngine.js
      pdaPresets.js
      pdaTheory.js
    tm/
      TMView.jsx
      tmEngine.js        # Binary addition TM simulation
      tmPresets.js
      tmTheory.js
    gnfa/
      GNFAView.jsx
      gnfaPresets.js     # One concept machine
      gnfaTheory.js
```

---

## Engine API Contract

Every engine exports a single simulation function:

```js
function simulateX(machine, input) → { accepted, steps, error? }
```

**Step shape (DFA/NFA):**
```js
{ index: number, symbol: string|null, currentState?: string, currentStates?: string[] }
```

**Step shape (PDA):**
```js
{ index: number, symbol: string, state: string, stack: string[], action: string }
```

**Step shape (TM):**
```js
{ index: number, tape: string[], head: number, state: string, action: string }
```

---

## Component Props API

### MachineCanvas
```
Props: { machine, activeStates: string[], currentTransition?: {from,to} }
```
Renders SVG state graph. States are circles. Start state gets incoming arrow. Accept states get double border. Active states glow. Transition labels shown on edges.

### TracePanel
```
Props: { steps: Step[], accepted: boolean|null }
```
Renders execution trace as numbered rows. Highlights the current step.

### TapeView
```
Props: { tape: string[], head: number }
```
Horizontal row of cells. Current cell highlighted. Head indicator (▼) above.

### StackView
```
Props: { stack: string[] }
```
Vertical list with top element highlighted. Light push/pop animation via CSS.

---

## Build Tasks (Agent Work Packages)

### Task 1: App Shell
**Files:** `App.jsx`, `Header.jsx`, `TopTabs.jsx`, `ControlBar.jsx`, `main.jsx`, `index.html`, all CSS files
**Deliverable:** Tabbed 3-panel layout renders. Tab switching works. Control bar has input + buttons (not wired).
**Acceptance:** `npm run dev` shows layout. DFA tab selected by default.

### Task 2: DFA + NFA Engines + Views
**Files:** `dfaEngine.js`, `nfaEngine.js`, `dfaPresets.js`, `nfaPresets.js`, `dfaTheory.js`, `nfaTheory.js`, `DFAView.jsx`, `NFAView.jsx`
**Deliverable:** Both modules work end-to-end. Input → Run → trace appears. Graph highlights active states.
**Acceptance:** Load "Even number of 1s" preset, type `1010`, click Run → accepted + trace steps visible.

### Task 3: Shared Visualization Components
**Files:** `MachineCanvas.jsx`, `TracePanel.jsx`, `ResultBadge.jsx`, `TheoryPanel.jsx`, `PresetSelector.jsx`, `graphLayout.js`
**Deliverable:** SVG state graph renders with start markers, double accept borders, transition arrows, active highlights. Trace panel shows rows.
**Acceptance:** DFA and NFA views use these components. Visual output matches spec.

### Task 4: PDA Module
**Files:** `pdaEngine.js`, `pdaPresets.js`, `pdaTheory.js`, `StackView.jsx`, `PDAView.jsx`
**Deliverable:** PDA simulation with stack visualization. "Balanced parens" and "a^n b^n" presets work.
**Acceptance:** Input `(())` on balanced parens → Run → accepted, stack trace shows push/pop per step.

### Task 5: TM Addition Module
**Files:** `tmEngine.js`, `tmPresets.js`, `tmTheory.js`, `TapeView.jsx`, `TMView.jsx`
**Deliverable:** Binary addition TM with tape visualization. Head moves, tape cells update per step.
**Acceptance:** Input `101+11` → Run → tape shows `1000`, trace shows each head movement.

### Task 6: GNFA Concept Page
**Files:** `gnfaPresets.js`, `gnfaTheory.js`, `GNFAView.jsx`
**Deliverable:** Static GNFA page showing regex-labeled graph + explanation. No elimination UI.
**Acceptance:** GNFA tab shows graph with regex labels on edges. Explanation text visible.

### Task 7: Polish & README
**Files:** `README.md`, all CSS files, `App.jsx`
**Acceptance:** Responsive breakpoints work. README complete. Error states handled.
**Acceptance:** App works on mobile viewport. README matches built product.

---

## Milestone Order

| # | Milestone | Tasks |
|---|-----------|-------|
| M1 | Shell renders with tabs | Task 1 |
| M2 | DFA works end-to-end | Task 2 (DFA half) + Task 3 |
| M3 | NFA works with multi-state highlight | Task 2 (NFA half) |
| M4 | PDA works with stack view | Task 4 |
| M5 | TM addition works with tape view | Task 5 |
| M6 | GNFA concept page | Task 6 |
| M7 | Polish, responsive, README | Task 7 |

---

## Tech Stack

- **React 19** (function components + hooks)
- **Vite 8** (dev server + build)
- **SVG** for all visualizations (no Canvas API, no D3, no Cytoscape)
- **CSS** for clean light-theme UI
- **No external runtime dependencies** beyond react + react-dom

## Success Criteria

- A beginner loads a preset, clicks Run, and sees the machine work step-by-step
- All 5 modules accessible from one tab bar
- TM tape visualization is clear and understandable
- GNFA page teaches the concept even without interactive editing
- Works as a static SPA — no backend calls, no login
