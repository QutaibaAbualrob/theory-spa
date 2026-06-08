export const gnfaTheory = {
  summary:
    "A Generalized Non-deterministic Finite Automaton (GNFA) is a finite automaton where transitions are labeled with regular expressions instead of single symbols. GNFAs are a theoretical tool used to convert any DFA or NFA into an equivalent regular expression.",
  howItWorks: [
    "Each edge in a GNFA carries a regular expression (e.g., 'a', 'a|b', '0*', '(01)*').",
    "The GNFA accepts an input string if there exists a path from start to accept such that the concatenated symbols along the path match the regular expression pattern.",
    "A GNFA must have exactly one start state (no incoming edges) and one accept state (no outgoing edges).",
    "There is a transition between every pair of states (including self-loops) labeled with a regular expression — ∅ (empty set) if no real transition exists.",
  ],
  keyConcepts: [
    "State Elimination: the process of removing a state and updating all remaining edges to preserve language equivalence.",
    "When eliminating state q, for every pair of remaining states (qᵢ, qⱼ), the new edge label becomes: R_new = R_ij | R_iq (R_qq)* R_qj",
    "After eliminating all original states, only the start and accept remain with a single regex label — the language of the original automaton.",
    "Every DFA and NFA can be converted to a GNFA, which can then be reduced to a single regular expression.",
  ],
  practiceTip:
    "The GNFA state elimination formula looks complex at first: R_new = R₁(R₂)*R₃ ∪ R₄. It means: paths through the eliminated state combine the incoming edge, the self-loop (star), and the outgoing edge, OR'd with any existing direct edge.",
};
