/**
 * TM engine — binary addition Turing Machine simulation.
 *
 * simulateTM(machine, input)
 *   machine  — preset object (transition table for reference display)
 *   input    — string like "101+11"
 *
 * Returns: { accepted: boolean, steps: Step[], error?: string }
 *
 * Step shape:
 *   { index: number, tape: string[], head: number, state: string, action: string }
 *
 * The engine performs binary addition algorithmically, not by table lookup,
 * generating step-by-step tape snapshots.
 */

export function simulateTM(machine, input) {
  const steps = [];

  // Validate input
  if (!input || !/^[01]+\+[01]+$/.test(input)) {
    return {
      accepted: false,
      steps: [],
      error: 'Invalid input. Enter two binary numbers separated by + (e.g., "101+11").',
    };
  }

  const parts = input.split('+');
  const num1 = parts[0];
  const num2 = parts[1];

  // Build tape: [_ | num1 | + | num2 | _]
  const tape = ['_', ...num1.split(''), '+', ...num2.split(''), '_'];
  const maxSteps = 100; // safety limit

  // Step 0: initial state
  steps.push({
    index: 0,
    tape: [...tape],
    head: 1,
    state: 'q0',
    action: 'Start',
  });

  // Phase 1: Scan to right end (q0 → q1)
  let head = 1;
  // Move through num1
  while (head < tape.length - 1 && tape[head] !== '+') {
    head++;
    steps.push({
      index: steps.length,
      tape: [...tape],
      head,
      state: 'q1',
      action: `Scanning right (position ${head}: '${tape[head]}')`,
    });
    if (steps.length >= maxSteps) break;
  }

  // Move through '+' separator
  if (tape[head] === '+') {
    head++;
    steps.push({
      index: steps.length,
      tape: [...tape],
      head,
      state: 'q1',
      action: `Scanning right (position ${head}: '${tape[head]}')`,
    });
  }

  // Move through num2 to the end
  while (head < tape.length - 1) {
    head++;
    steps.push({
      index: steps.length,
      tape: [...tape],
      head,
      state: 'q2',
      action: `Scanning right through num2 (position ${head}: '${tape[head]}')`,
    });
    if (steps.length >= maxSteps) break;
  }

  // Phase 2: Addition right-to-left
  let pos1 = num1.length; // last index of num1 in tape
  let pos2 = num2.length; // last index of num2 in tape
  // On the tape: [_, n1[0], n1[1], ..., n1[len-1], +, n2[0], ..., n2[len-1], _]
  // num1 occupies indices 1 through num1.length
  // num2 occupies indices num1.length + 2 through num1.length + 1 + num2.length
  const num1Start = 1;
  const num2Start = num1.length + 2;
  let carry = 0;

  const maxLen = Math.max(num1.length, num2.length);

  for (let col = 0; col < maxLen; col++) {
    const idx1 = num1Start + (num1.length - 1 - col);
    const idx2 = num2Start + (num2.length - 1 - col);
    const bit1 = idx1 >= num1Start && idx1 < num1Start + num1.length
      ? parseInt(tape[idx1], 10)
      : 0;
    const bit2 = idx2 >= num2Start && idx2 < num2Start + num2.length
      ? parseInt(tape[idx2], 10)
      : 0;

    const sum = bit1 + bit2 + carry;
    const resultBit = sum % 2;
    carry = Math.floor(sum / 2);

    // Move head to num1 position (scanning left)
    while (head > idx1) {
      head--;
      steps.push({
        index: steps.length,
        tape: [...tape],
        head,
        state: 'q3',
        action: `Moving left to column ${col + 1}`,
      });
      if (steps.length >= maxSteps) break;
    }

    // Read bit1
    steps.push({
      index: steps.length,
      tape: [...tape],
      head,
      state: 'q3',
      action: `Reading bit: ${bit1}`,
    });
    if (steps.length >= maxSteps) break;

    // Move to num2 position
    while (head < idx2) {
      head++;
      steps.push({
        index: steps.length,
        tape: [...tape],
        head,
        state: 'q3',
        action: `Moving right to second operand`,
      });
      if (steps.length >= maxSteps) break;
    }

    // Read bit2
    steps.push({
      index: steps.length,
      tape: [...tape],
      head,
      state: 'q3',
      action: `Reading bit: ${bit2}`,
    });
    if (steps.length >= maxSteps) break;

    // Move back to num1 position
    while (head > idx1) {
      head--;
      steps.push({
        index: steps.length,
        tape: [...tape],
        head,
        state: 'q3',
        action: `Moving back to write result`,
      });
      if (steps.length >= maxSteps) break;
    }

    // Write result
    tape[idx1] = resultBit.toString();
    steps.push({
      index: steps.length,
      tape: [...tape],
      head,
      state: 'q3',
      action: `${bit1}+${bit2}+carry(${carry - (bit1 + bit2)})=${sum} → write ${resultBit}, carry=${carry}`,
    });
    if (steps.length >= maxSteps) break;
  }

  // Handle final carry
  if (carry > 0) {
    // Move head to position 0 (before num1)
    while (head > 0) {
      head--;
      steps.push({
        index: steps.length,
        tape: [...tape],
        head,
        state: 'q3',
        action: `Moving left for final carry`,
      });
      if (steps.length >= maxSteps) break;
    }

    // Prepend '1' to tape
    tape.splice(1, 0, '1');
    // Head is now at position 0 (_), advance to the new '1'
    head = 1;
    steps.push({
      index: steps.length,
      tape: [...tape],
      head,
      state: 'q3',
      action: `Final carry: write 1 at front → tape now shows result`,
    });
  }

  // Final step
  steps.push({
    index: steps.length,
    tape: [...tape],
    head,
    state: 'q_accept',
    action: 'Addition complete. Halt.',
  });

  return { accepted: true, steps };
}
