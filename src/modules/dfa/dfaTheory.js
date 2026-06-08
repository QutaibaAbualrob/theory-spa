export const dfaTheory = {
  summary:
    'A Deterministic Finite Automaton (DFA) is a theoretical model of computation. It reads a string of symbols one at a time and transitions between states based on the current state and input symbol. There is exactly one transition for each state-symbol pair — the machine\'s behavior is fully determined by its input.',
  howItWorks: [
    'The machine starts in a designated start state.',
    'For each symbol in the input string, it follows exactly one transition based on its current state and the symbol read.',
    'After consuming all symbols, if the machine is in an accept state, the input is accepted.',
  ],
  keyConcepts: [
    'Deterministic: exactly one possible next state for each state-symbol pair',
    'Finite: a fixed, finite number of states',
    'Accept states: special states that indicate successful computation',
  ],
  practiceTip:
    "Try input '1010' on 'Even number of 1s'. It has two 1s (an even count), so it should be accepted. Try '101' (three 1s) — it should be rejected.",
};
