# TOC Visual Lab

**A browser-based automata learning SPA** — interactive visual simulations of DFA, NFA, PDA, Turing Machine (binary addition), and GNFA.

Built with React 19 + Vite. Fully client-side. No backend, no auth, no database.

## Modules

| Module | Description | Presets |
|--------|-------------|---------|
| DFA | Deterministic finite automaton — step through states on each input symbol | Even number of 1s, Ends with 01 |
| NFA | Nondeterministic finite automaton — multi-state simulation with ε-closure | Contains "01", Ends with "ab" or "ba" |
| PDA | Pushdown automaton — stack push/pop operations alongside state transitions | Balanced parentheses, aⁿbⁿ |
| TM Addition | Turing machine for binary addition — read/write tape with head movement | 1+1, 10+1, 101+11 |
| GNFA | Generalized nondeterministic finite automaton — regex-labeled graph explorer | Simple 3-state machine |

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  App.jsx
  main.jsx
  styles/
    globals.css          # CSS variables, resets, typography
    layout.css           # 3-panel grid layout
  components/            # 8 shared components
    Header.jsx           # Title, subtitle
    TopTabs.jsx          # Tab bar (DFA/NFA/PDA/TM/GNFA)
    MachineCanvas.jsx    # SVG state graph
    TracePanel.jsx       # Execution trace rows
    ResultBadge.jsx      # Accepted / rejected indicator
    TheoryPanel.jsx      # Left panel: concept text + presets
    PresetSelector.jsx   # Dropdown / button list of presets
    StackView.jsx        # PDA stack visualization
    TapeView.jsx         # TM tape cells with head indicator
  modules/               # 5 self-contained modules
    dfa/                 # DFAView, dfaEngine, dfaPresets, dfaTheory
    nfa/                 # NFAView, nfaEngine, nfaPresets, nfaTheory
    pda/                 # PDAView, pdaEngine, pdaPresets, pdaTheory
    tm/                  # TMView, tmEngine, tmPresets, tmTheory
    gnfa/                # GNFAView, gnfaPresets, gnfaTheory
  utils/
    graphLayout.js       # Circular / linear node positioning
ref/                     # Reference summaries from similar projects
```

## Engine API

Every engine exports a single simulation function:

```js
function simulateX(machine, input) → { accepted, steps, error? }
```

| Module | Step shape |
|--------|------------|
| DFA / NFA | `{ index, symbol, currentState(s)? }` |
| PDA | `{ index, symbol, state, stack, action }` |
| TM | `{ index, tape, head, state, action }` |

## Presets

- **DFA:** Even number of 1s, Ends with 01
- **NFA:** Contains substring "01", Ends with "ab" or "ba"
- **PDA:** Balanced parentheses, aⁿbⁿ
- **TM Addition:** `1+1` → `10`, `10+1` → `11`, `101+11` → `1000`
- **GNFA:** Simple 3-state regex-labeled concept machine

## Tech Stack

- **React 19** — function components + hooks
- **Vite 8** — dev server + build
- **SVG** — all visualizations (no Canvas, no D3, no Cytoscape)
- **CSS** — clean light-theme UI
- **Zero extra runtime dependencies** — only react + react-dom

## License

MIT
