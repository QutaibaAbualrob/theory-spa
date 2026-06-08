/**
 * Compute epsilon closure of a set of state IDs.
 * Follows epsilon transitions until no new states are reachable.
 */
function epsClosure(stateIds, transitions) {
  const closure = new Set(stateIds);
  const stack = [...stateIds];
  while (stack.length > 0) {
    const sid = stack.pop();
    for (const t of transitions) {
      if (t.from === sid && t.symbol === "ε" && !closure.has(t.to)) {
        closure.add(t.to);
        stack.push(t.to);
      }
    }
  }
  return [...closure];
}

/**
 * Simulate an NFA step-by-step.
 * Supports epsilon transitions and multiple active states.
 * Returns { accepted, steps, error? }
 * Each step: { index, symbol, currentStates: string[] }
 */
export function simulateNFA(machine, input) {
  const { states, transitions } = machine;
  const startIds = states.filter((s) => s.start).map((s) => s.id);
  if (startIds.length === 0)
    return { accepted: false, steps: [], error: "No start state defined." };

  let currentStates = epsClosure(startIds, transitions);
  const steps = [{ index: 0, symbol: null, currentStates: [...currentStates] }];

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const nextSet = new Set();

    for (const sid of currentStates) {
      for (const t of transitions) {
        if (t.from === sid && t.symbol === symbol) {
          nextSet.add(t.to);
        }
      }
    }

    currentStates = epsClosure([...nextSet], transitions);
    steps.push({ index: i + 1, symbol, currentStates: [...currentStates] });

    if (currentStates.length === 0) {
      return { accepted: false, steps, error: `Stuck after '${symbol}' — no valid transitions.` };
    }
  }

  const accepted = currentStates.some((sid) => {
    const s = states.find((st) => st.id === sid);
    return s && s.accept;
  });

  return { accepted, steps };
}
