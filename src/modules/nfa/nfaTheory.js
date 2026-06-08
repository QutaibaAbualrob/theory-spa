export const nfaTheory = {
  summary:
    'A Non-deterministic Finite Automaton (NFA) is similar to a DFA but can have multiple possible transitions for the same state-symbol pair. The NFA is considered to accept if there exists at least one path through the machine that ends in an accept state.',
  howItWorks: [
    'The machine can be in multiple states at once.',
    'For each symbol, it follows all possible transitions from all current states simultaneously.',
    'Epsilon (ε) transitions let the machine change states without consuming any input.',
    'The input is accepted if any of the active states at the end is an accept state.',
  ],
  keyConcepts: [
    'Non-determinism: multiple possible paths for the same input',
    'Epsilon transitions: move between states without reading input',
    'Every NFA can be converted to an equivalent DFA (subset construction)',
  ],
  practiceTip:
    "Try '01' on 'Contains 01'. The NFA should accept because it can find the subsequence '01' even if there are extra symbols around it.",
};
