export const tmTheory = {
  summary:
    'A Turing Machine is the most powerful model of computation — it can read, write, and move on an infinite tape. It formalizes the concept of an algorithm and defines the boundary of what is computable.',
  howItWorks: [
    'The machine has an infinite tape divided into cells, each holding one symbol. A read-write head points to one cell at a time.',
    'The machine has a finite set of states. At each step, it reads the symbol under the head.',
    'Based on the current state and the symbol read, the machine writes a new symbol, moves the head left or right, and transitions to a new state.',
    'If the machine enters an accepting (halting) state, it stops and the computation is complete.',
    'The initial tape contains the input string surrounded by blank symbols (_).',
  ],
  keyConcepts: [
    'Infinite tape — unlimited memory that can be read from and written to.',
    'Read-write head — the head can move left or right one cell at a time, allowing the machine to revisit earlier symbols.',
    'State machine — a finite control unit that determines the next action based on the current state and tape symbol.',
    'Halting — a Turing Machine that reaches a final state halts and accepts. It may also reject or loop forever.',
    'Binary addition TM — this module implements a specific TM that performs binary addition algorithmically, showing the head scanning and writing steps.',
  ],
  practiceTip:
    'Watch how the head moves right to scan each bit, then left to write the result.',
};
