# AleKiller21/Automata-Visualizer — Reference Summary

**Repo:** https://github.com/AleKiller21/Automata-Visualizer
**Tech:** Vanilla JS + jQuery + JointJS + Materialize CSS (no React)
**Last updated:** ~9 years ago | 142 commits

## Overview

A complete browser-based automata visualizer built for a Theory of Computation course. It's a single HTML page with heavy JavaScript for diagram editing and simulation. Covers DFA, NFA, NFA-Epsilon, PDA, Turing Machine, and Grammar operations. The code is class-based with a prototype inheritance chain.

## Architecture

```
index.html ← single page, all HTML in one file
resources/
  css/          ← MaterializeCSS + JointJS + custom styles
  img/          ← favicon
  scripts/
    libs/       ← jquery, lodash, backbone, joint, materialize, regex lib
    Diagram/    ← JointJS shape definitions + diagram controller
    Automata/
      automaton.js           ← base class
      state.js               ← state model
      transition.js          ← transition model
      regularLanguage.js     ← union/intersection/complement
      minimize.js            ← DFA minimization
      DFA/
        dfa.js               ← DFA class
        dfaController.js     ← UI controller
      NFA/
        nfa.js               ← NFA class + convertToDFA
        nfaController.js
      NFAE/                 ← NFA with epsilon
      PDA/
        pda.js               ← PDA class (extends NFAE)
        pdaController.js
      Turing/
        turing.js            ← TM class
        turingController.js
    Grammar/                 ← CFG ←→ PDA conversion
    Loader/                  ← JSON import/export + URL loader
    RegEx/                   ← regex ←→ NFA-E conversion
```

## Class Hierarchy

```
Automaton ← DFA
          ← NFA ← NFAE ← PDA
          ← Turing
```

## Engine Patterns

### DFA (`dfa.js`)
- `processWord(word)` iterates through input, follows transitions one per symbol
- Validates determinism (checks for duplicate symbols on same state)
- Returns `{valid, msg}` — no step-by-step trace, just final result
- **Key method missing for our MVP:** No step-by-step trace generation — only final accept/reject

### NFA (`nfa.js`)
- Tracks **array of current states**
- `consumeSymbol(currentStates, symbol)` — collects all reachable states
- `isWordValid(currentStates)` — checks if **any** current state is final
- No epsilon support in base NFA (NFAE subclass handles that)
- `convertToDFA()` — subset construction algorithm (important for our "nice-to-have")

### NFAE (NFA with Epsilon) — inferred structure
- Extends NFA, adds epsilon closure computation
- PDA extends this for its own epsilon closure needs

### PDA (`pda.js`)
- **Runner-based nondeterministic simulation**
- `processWord(word)` creates a `runner = {state, word, stack: [Z]}`
- `evaluateRunner()` handles:
  - Epsilon transitions (calls `getEpsilonClosure`)
  - Symbol consumption (calls `consumeSymbol`)
  - Stack operations (`applyStackOperation`)
  - Infinite loop detection (stack depth check)
- Stack operations: transition label format `"symbol,pop/push"`
  - e.g., `"0,Z/XZ"` means read `0`, pop `Z`, push `XZ`
- Has runners limit (512, doubled on confirm) to prevent infinite loops
- **Architecture insight:** Full nondeterministic PDA simulation with branching runners

### Turing Machine (`turing.js`)
- Tape as array, head as integer index
- `processWord(word)` initializes tape: `[B, ...word, B]` (B = blank)
- Transition label format: `"read,write,direction"` e.g., `"0,1,R"`
- `evaluate()` loops until final state is reached:
  - Reads current tape symbol
  - Finds matching transition (read symbol)
  - Writes to tape
  - Moves head L/R
  - Transitions to next state
- **Simple and clean** — exactly what our MVP needs

## Data Representation

States have: `id, name, internalName, {initial, final}`
Transitions have: `id, symbol, source, target`

Transition label formats:
- DFA/NFA: `"a"`, `"b"`, etc. (single symbols)
- PDA: `"symbol,pop/push"` → `"0,Z/XZ"`
- TM: `"read,write,direction"` → `"0,1,R"`

## Features Our MVP Should Borrow

| Feature | Implementation |
|---------|---------------|
| **DFA validation** | Check duplicates on same state+symbol |
| **NFA multi-state tracking** | Array of active states |
| **PDA stack operations** | Clear push/pop model with Z marker |
| **TM tape model** | Array + head index, blank symbols at ends |
| **Convert NFA to DFA** | Subset construction (nice-to-have) |
| **Minimization** | Table-filling algorithm (nice-to-have) |

## Things to Do Differently (in React)

| Old (jQuery) | Our React MVP |
|--------------|---------------|
| Class inheritance chain | Composition: pure engine functions |
| JointJS for diagram | Custom SVG (no dependencies) |
| DOM manipulation via jQuery | React declarative rendering |
| No step-by-step trace | Step-by-step trace array from engines |
| Modal popups for inputs | Inline inputs in control bar |

## Key Code Snippets for Agent Reference

### TM evaluation loop (simplest engine):
```
read symbol at head
find transition where transition.read === tape[head]
write transition.write to tape[head]
move head L or R
go to next state
repeat until final state
```

### PDA stack operation:
```
if pop !== ε: stack.pop()
if push !== ε: for char in push reversed: stack.push(char)
```

### NFA state tracking:
```
currentStates = [initialState]
for each symbol in input:
  nextStates = []
  for state in currentStates:
    for transition in state.transitions:
      if transition.symbol === symbol:
        nextStates.push(transition.target)
  currentStates = nextStates
accept if ANY currentState is final
```
