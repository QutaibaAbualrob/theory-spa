/**
 * DFA Engine
 * ----------------------------------------------------------------------------
 * simulateDFA(machine, input) → { accepted, steps, error }
 * validateDFA(machine)        → { valid, errors }
 */

export function simulateDFA(machine, input) {
  const steps = [];

  // Find start state
  const startState = machine.states.find((s) => s.start);
  if (!startState) {
    return { accepted: false, steps: [], error: 'No start state defined.' };
  }

  // Step 0: before consuming any input
  steps.push({ index: 0, symbol: null, currentState: startState.id });

  let currentId = startState.id;

  for (let i = 0; i < input.length; i++) {
    const sym = input[i];
    const transition = machine.transitions.find(
      (t) => t.from === currentId && t.symbol === sym
    );

    if (!transition) {
      steps.push({
        index: i + 1,
        symbol: sym,
        currentState: null,
      });
      return {
        accepted: false,
        steps,
        error: `No transition from ${currentId} on '${sym}'.`,
      };
    }

    currentId = transition.to;
    steps.push({ index: i + 1, symbol: sym, currentState: currentId });
  }

  const finalState = machine.states.find((s) => s.id === currentId);
  const accepted = finalState ? finalState.accept : false;

  return { accepted, steps, error: null };
}

export function validateDFA(machine) {
  const errors = [];

  if (!machine.states || machine.states.length === 0) {
    errors.push('Machine must have at least one state.');
    return { valid: false, errors };
  }

  // Exactly one start state
  const startStates = machine.states.filter((s) => s.start);
  if (startStates.length === 0) {
    errors.push('No start state defined. Exactly one state must have start: true.');
  } else if (startStates.length > 1) {
    errors.push(`Multiple start states found: ${startStates.map((s) => s.id).join(', ')}. Exactly one is allowed.`);
  }

  const stateIds = new Set(machine.states.map((s) => s.id));
  const alphabet = new Set(machine.alphabet);

  // Transition validity
  machine.transitions.forEach((t, idx) => {
    if (!stateIds.has(t.from)) {
      errors.push(`Transition ${idx}: from-state "${t.from}" does not exist.`);
    }
    if (!stateIds.has(t.to)) {
      errors.push(`Transition ${idx}: to-state "${t.to}" does not exist.`);
    }
    if (!alphabet.has(t.symbol)) {
      errors.push(`Transition ${idx}: symbol "${t.symbol}" is not in alphabet [${machine.alphabet.join(', ')}].`);
    }
  });

  // Duplicate transitions
  const seen = new Map();
  machine.transitions.forEach((t, idx) => {
    const key = `${t.from}::${t.symbol}`;
    if (seen.has(key)) {
      const prev = seen.get(key);
      if (prev !== t.to) {
        errors.push(
          `Duplicate transition from ${t.from} on '${t.symbol}': targets both ${prev} and ${t.to}.`
        );
      }
    } else {
      seen.set(key, t.to);
    }
  });

  return { valid: errors.length === 0, errors };
}
