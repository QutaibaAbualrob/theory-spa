/**
 * NFA preset machines
 */

export const nfaPresets = [
  {
    id: 'nfa-contains-01',
    type: 'nfa',
    title: 'Contains substring 01',
    description: 'Accepts strings over {0,1} that contain the subsequence "01".',
    states: [
      { id: 'q0', label: 'q0', start: true, accept: false, x: 80, y: 200 },
      { id: 'q1', label: 'q1', start: false, accept: false, x: 290, y: 200 },
      { id: 'q2', label: 'q2', start: false, accept: true, x: 500, y: 200 },
    ],
    alphabet: ['0', '1'],
    transitions: [
      { from: 'q0', to: 'q0', symbol: '0' },
      { from: 'q0', to: 'q0', symbol: '1' },
      { from: 'q0', to: 'q1', symbol: '0' },
      { from: 'q1', to: 'q2', symbol: '1' },
      { from: 'q2', to: 'q2', symbol: '0' },
      { from: 'q2', to: 'q2', symbol: '1' },
    ],
    sampleInputs: ['01', '101', '1101', '000', '1111'],
  },
  {
    id: 'nfa-ends-ab-or-ba',
    type: 'nfa',
    title: 'Ends with ab or ba',
    description: 'Accepts strings over {a,b} that end with either "ab" or "ba".',
    states: [
      { id: 'q0', label: 'q0', start: true, accept: false, x: 50, y: 200 },
      { id: 'q1', label: 'q1', start: false, accept: false, x: 190, y: 120 },
      { id: 'q2', label: 'q2', start: false, accept: true, x: 350, y: 200 },
      { id: 'q3', label: 'q3', start: false, accept: false, x: 510, y: 120 },
    ],
    alphabet: ['a', 'b'],
    transitions: [
      { from: 'q0', to: 'q0', symbol: 'a' },
      { from: 'q0', to: 'q0', symbol: 'b' },
      { from: 'q0', to: 'q1', symbol: 'a' },
      { from: 'q0', to: 'q3', symbol: 'b' },
      { from: 'q1', to: 'q2', symbol: 'b' },
      { from: 'q3', to: 'q2', symbol: 'a' },
      { from: 'q2', to: 'q2', symbol: 'a' },
      { from: 'q2', to: 'q2', symbol: 'b' },
    ],
    sampleInputs: ['ab', 'ba', 'aab', 'bba', 'abba'],
  },
];
