export const pdaPresets = [
  {
    id: 'pda-balanced-parens',
    type: 'pda',
    title: 'Balanced Parentheses',
    description:
      "Accepts strings of '(' and ')' where every opening paren has a matching closing paren.",
    states: [
      { id: 'q0', label: 'q0', start: true, accept: true, x: 250, y: 200 },
    ],
    alphabet: ['(', ')'],
    stackStart: 'Z',
    transitions: [
      { from: 'q0', to: 'q0', read: '(', pop: 'Z', push: 'XZ' },
      { from: 'q0', to: 'q0', read: '(', pop: 'X', push: 'XX' },
      { from: 'q0', to: 'q0', read: ')', pop: 'X', push: 'ε' },
      { from: 'q0', to: 'q0', read: 'ε', pop: 'Z', push: 'ε' },
    ],
    sampleInputs: ['()', '(())', '()()', '((()))', '(()'],
  },
  {
    id: 'pda-an-bn',
    type: 'pda',
    title: 'aⁿbⁿ',
    description:
      "Accepts strings with N a's followed by N b's (e.g., 'ab', 'aabb', 'aaabbb').",
    states: [
      { id: 'q0', label: 'q0', start: true, x: 150, y: 200 },
      { id: 'q1', label: 'q1', accept: true, x: 350, y: 200 },
    ],
    alphabet: ['a', 'b'],
    stackStart: 'Z',
    transitions: [
      { from: 'q0', to: 'q0', read: 'a', pop: 'Z', push: 'AZ' },
      { from: 'q0', to: 'q0', read: 'a', pop: 'A', push: 'AA' },
      { from: 'q0', to: 'q1', read: 'b', pop: 'A', push: 'ε' },
      { from: 'q1', to: 'q1', read: 'b', pop: 'A', push: 'ε' },
      { from: 'q1', to: 'q1', read: 'ε', pop: 'Z', push: 'ε' },
    ],
    sampleInputs: ['ab', 'aabb', 'aaabbb', 'aab', 'abb'],
  },
];
