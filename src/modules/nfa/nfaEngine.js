/**
 * NFA Engine
 * ----------------------------------------------------------------------------
 * simulateNFA(machine, input) → { accepted, steps, error }
 *
 * Nondeterministic: tracks multiple active states simultaneously.
 * Epsilon transitions followed recursively before consuming each symbol.
 */

function epsilonClosure(stateIds, transitions) {
  const visited = new Set(stateIds);
  const queue = [...stateIds];

  while (queue.length > 0) {
    const current = queue.shift();
    const epsTransitions = transitions.filter(
      (t) => t.from === current && t.symbol === 'ε'
    );
    for (const t of epsTransitions) {
      if (!visited.has(t.to)) {
        visited.add(t.to);
        queue.push(t.to);
      }
    }
  }

  return Array.from(visited);
}

export function simulateNFA(machine, input) {
  const steps = [];

  const startStates = machine.states.filter((s) => s.start);
  if (startStates.length === 0) {
    return { accepted: false, steps: [], error: 'No start state defined.' };
  }

  // Step 0: epsilon closure of start states
  let currentStates = epsilonClosure(
    startStates.map((s) => s.id),
    machine.transitions
  );
  steps.push({ index: 0, symbol: null, currentStates: [...currentStates] });

  for (let i = 0; i < input.length; i++) {
    const sym = input[i];

    // Find all transitions matching symbol from any current state
    const nextSet = new Set();
    for (const cs of currentStates) {
      const matches = machine.transitions.filter(
        (t) => t.from === cs && t.symbol === sym
      );
      for (const m of matches) {
        nextSet.add(m.to);
      }
    }

    if (nextSet.size === 0) {
      steps.push({ index: i + 1, symbol: sym, currentStates: [] });
      return {
        accepted: false,
        steps,
        error: `Stuck at symbol '${sym}' — no valid transitions from any active state.`,
      };
    }

    // Compute epsilon closure of the new set
    currentStates = epsilonClosure(Array.from(nextSet), machine.transitions);
    steps.push({ index: i + 1, symbol: sym, currentStates: [...currentStates] });
  }

  const stateLookup = new Map(machine.states.map((s) => [s.id, s]));
  const accepted = currentStates.some((id) => stateLookup.get(id)?.accept);

  return { accepted, steps, error: null };
}
