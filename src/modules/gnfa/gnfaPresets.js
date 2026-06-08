export const gnfaPresets = [
  {
    id: "gnfa-dfa-to-regex",
    type: "gnfa",
    title: "DFA → Regex Converter",
    description:
      "A GNFA with regex-labeled transitions, demonstrating how state elimination converts an automaton to a regular expression.",
    states: [
      { id: "qs", label: "q_start", start: true, accept: false, x: 120, y: 200 },
      { id: "q0", label: "q0", start: false, accept: false, x: 280, y: 120 },
      { id: "q1", label: "q1", start: false, accept: false, x: 280, y: 280 },
      { id: "qa", label: "q_accept", start: false, accept: true, x: 440, y: 200 },
    ],
    alphabet: ["0", "1"],
    transitions: [
      { from: "qs", to: "q0", symbol: "ε" },
      { from: "q0", to: "q0", symbol: "1" },
      { from: "q0", to: "q1", symbol: "0" },
      { from: "q1", to: "q1", symbol: "0" },
      { from: "q1", to: "q0", symbol: "1" },
      { from: "q0", to: "qa", symbol: "ε" },
    ],
    eliminationSteps: [
      {
        title: "Initial GNFA",
        description:
          "We start with a 3-state GNFA derived from a DFA that accepts strings ending with '0'. New start (q_start) and accept (q_accept) states have been added with ε transitions.",
        formula: null,
      },
      {
        title: "Eliminate q1",
        description:
          "Removing q1. The only path through q1 goes q0 → q1 → q0: label '0' on q1 self-loop, '1' on q1→q0. Formula: R_new = R_q0→q1 (R_q1→q1)* R_q1→q0 = 0(0)*1 = 0⁺1. Since there's no existing direct edge q0→q0 for this path, the new self-loop on q0 becomes: 1 | 0(0)*1 = 1 | 0⁺1.",
        formula: "R_new = R_q0→q1 (R_q1→q1)* R_q1→q0 = 0·(0)*·1 = 0⁺1",
      },
      {
        title: "Eliminate q0",
        description:
          "Removing q0. The start-to-accept path goes qs → q0 → qa with q0's self-loop. Formula: R = R_qs→q0 (R_q0→q0)* R_q0→qa = ε·(1|0⁺1)*·ε = (1|0⁺1)*.",
        formula: "R = ε·(1|0⁺1)*·ε = (1|0⁺1)*",
      },
      {
        title: "Final Regular Expression",
        description:
          "After eliminating all intermediate states, only q_start and q_accept remain. The edge between them is labeled with the final regular expression: (1|0⁺1)*. This describes the original DFA's language: strings over {0,1} ending with 0, where 0⁺ means one or more zeros.",
        formula: "Final regex: (1|0⁺1)*",
      },
    ],
  },
];
