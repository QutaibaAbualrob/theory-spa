/**
 * DFA preset machines
 */

export const dfaPresets = [
  {
    id: 'dfa-even-ones',
    type: 'dfa',
    title: 'Even number of 1s',
    description: 'Accepts binary strings with an even count of 1.',
    states: [
      { id: 'q0', label: 'q0', start: true, accept: true, x: 120, y: 200 },
      { id: 'q1', label: 'q1', start: false, accept: false, x: 320, y: 200 },
    ],
    alphabet: ['0', '1'],
    transitions: [
      { from: 'q0', to: 'q0', symbol: '0' },
      { from: 'q0', to: 'q1', symbol: '1' },
      { from: 'q1', to: 'q1', symbol: '0' },
      { from: 'q1', to: 'q0', symbol: '1' },
    ],
    sampleInputs: ['0', '11', '101', '000', ''],
  },
  {
    id: 'dfa-ends-with-01',
    type: 'dfa',
    title: 'Ends with 01',
    description: 'Accepts binary strings that end with the pattern "01".',
    states: [
      { id: 'q0', label: 'q0', start: true, accept: false, x: 70, y: 200 },
      { id: 'q1', label: 'q1', start: false, accept: false, x: 250, y: 140 },
      { id: 'q2', label: 'q2', start: false, accept: true, x: 430, y: 200 },
    ],
    alphabet: ['0', '1'],
    transitions: [
      { from: 'q0', to: 'q1', symbol: '0' },
      { from: 'q0', to: 'q0', symbol: '1' },
      { from: 'q1', to: 'q1', symbol: '0' },
      { from: 'q1', to: 'q2', symbol: '1' },
      { from: 'q2', to: 'q1', symbol: '0' },
      { from: 'q2', to: 'q0', symbol: '1' },
    ],
    sampleInputs: ['01', '001', '101', '0101', '010'],
  },
];
