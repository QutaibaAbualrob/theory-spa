/**
 * Simulate a DFA step-by-step.
 * Returns { accepted, steps, error? }
 * Each step: { index, symbol, currentState }
 */
export function simulateDFA(machine, input) {
  const { states, transitions } = machine;
  let current = states.find((s) => s.start);
  if (!current) return { accepted: false, steps: [], error: "No start state defined." };

  const steps = [{ index: 0, symbol: null, currentState: current.id }];

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const t = transitions.find(
      (t) => t.from === current.id && t.symbol === symbol
    );
    if (!t) {
      steps.push({ index: i + 1, symbol, currentState: null, rejected: true });
      return {
        accepted: false,
        steps,
        error: `No transition from ${current.id} on '${symbol}'.`,
      };
    }
    current = states.find((s) => s.id === t.to);
    if (!current) {
      return { accepted: false, steps, error: `State '${t.to}' not found.` };
    }
    steps.push({ index: i + 1, symbol, currentState: current.id });
  }

  return { accepted: !!current.accept, steps };
}

/**
 * Validate a DFA machine definition.
 * Returns { valid, errors[] }
 */
export function validateDFA(machine) {
  const errors = [];
  const { states, alphabet, transitions } = machine;

  if (!states || states.length === 0) errors.push("No states defined.");
  if (!alphabet || alphabet.length === 0) errors.push("No alphabet defined.");
  if (!transitions) errors.push("No transitions defined.");

  const stateIds = new Set(states.map((s) => s.id));
  const startStates = states.filter((s) => s.start);
  if (startStates.length !== 1) errors.push("Exactly one start state required.");

  // Check determinism: for each state + symbol, at most one transition
  for (const s of states) {
    for (const sym of alphabet) {
      const matches = transitions.filter(
        (t) => t.from === s.id && t.symbol === sym
      );
      if (matches.length > 1)
        errors.push(`Non-deterministic: ${s.id} on '${sym}' has ${matches.length} transitions.`);
    }
  }

  // Check all transitions reference valid states
  for (const t of transitions) {
    if (!stateIds.has(t.from)) errors.push(`Unknown from-state: '${t.from}'.`);
    if (!stateIds.has(t.to)) errors.push(`Unknown to-state: '${t.to}'.`);
    if (!alphabet.includes(t.symbol) && t.symbol !== "ε")
      errors.push(`Symbol '${t.symbol}' not in alphabet.`);
  }

  return { valid: errors.length === 0, errors };
}
