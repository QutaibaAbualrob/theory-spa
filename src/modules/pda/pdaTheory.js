export const pdaTheory = {
  summary:
    "A Pushdown Automaton (PDA) is a finite automaton with a stack — extra memory that lets it recognize context-free languages. It combines an NFA's state transitions with a push/pop stack that can track nesting and counting.",
  howItWorks: [
    "Start in the initial state with the stack containing the bottom marker (usually Z).",
    "Read the first input symbol. Find a transition matching the current state, input symbol, and top-of-stack symbol.",
    "Pop the matched symbol from the stack, then optionally push one or more symbols back onto the stack (pushed right-to-left, so the first character ends up on top).",
    "Move to the next state. An epsilon transition (ε) can change state or manipulate the stack without consuming input.",
    "If the input is fully consumed and the machine is in an accepting (final) state, the string is accepted.",
  ],
  keyConcepts: [
    "Stack memory — the stack provides unlimited (in theory) LIFO storage alongside the finite state control.",
    "Push / Pop operations — push adds to the top of the stack; pop removes from the top. Only the top element is accessible.",
    "Deterministic vs. Nondeterministic PDA — an NPDA can have multiple possible transitions for the same state+symbol+stack combination, giving it guessing power.",
    "Context-free languages — PDAs recognize exactly the set of context-free languages (e.g., balanced parentheses, aⁿbⁿ, palindromes).",
  ],
  practiceTip:
    "Try 'aaabbb' on aⁿbⁿ — it pushes 3 A's then pops 3 A's. Try 'aab' — stack doesn't empty, rejected.",
};
