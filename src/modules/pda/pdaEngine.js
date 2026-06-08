/**
 * PDA engine — pushdown automaton simulation.
 *
 * simulatePDA(machine, input)
 *   machine  — preset object with states[], transitions[], stackStart
 *   input    — string of symbols
 *
 * Returns: { accepted: boolean, steps: Step[], error?: string }
 *
 * Step shape:
 *   { index: number, symbol: string|null, state: string, stack: string[], action: string }
 */

export function simulatePDA(machine, input) {
  const steps = [];
  const stackStart = machine.stackStart || 'Z';

  // Find start state
  const startState = machine.states.find((s) => s.start);
  if (!startState) {
    return { accepted: false, steps: [], error: 'No start state defined.' };
  }

  let currentState = startState.id;
  let stack = [stackStart];

  // Step 0: initial
  steps.push({
    index: 0,
    symbol: null,
    state: currentState,
    currentState: currentState,
    stack: [...stack],
    action: 'Start',
  });

  let pos = 0;
  const maxSteps = (input.length + 1) * 50; // safety limit

  while (pos <= input.length && steps.length < maxSteps) {
    const symbol = pos < input.length ? input[pos] : null;
    const top = stack[stack.length - 1];

    // Find matching transition: (from matches, read matches or ε, pop matches top or ε)
    // Try symbol match first, then ε match
    let transition = findTransition(
      machine.transitions,
      currentState,
      symbol || null,
      top
    );

    if (!transition) {
      // If at end of input and no transition, check if currentState is accept
      if (pos >= input.length) {
        break;
      }
      return {
        accepted: false,
        steps,
        error: `No valid transition from ${currentState} on '${symbol}' (stack top: ${top})`,
      };
    }

    // Apply stack operation
    if (transition.pop !== 'ε') {
      if (stack[stack.length - 1] === transition.pop) {
        stack.pop();
      } else {
        // pop mismatch — shouldn't happen if findTransition works correctly
        return {
          accepted: false,
          steps,
          error: `Stack top mismatch: expected '${transition.pop}', got '${top}'`,
        };
      }
    }

    // Push: push characters individually, right-to-left so first char ends on top
    if (transition.push !== 'ε') {
      // Push right-to-left: the first character of the push string should be on top
      for (let i = transition.push.length - 1; i >= 0; i--) {
        stack.push(transition.push[i]);
      }
    }

    // Move to target state
    currentState = transition.to;

    // Build action description
    let action = '';
    if (transition.read === 'ε' && transition.pop === 'ε' && transition.push === 'ε') {
      action = `ε → ${currentState}`;
    } else {
      const readStr = transition.read === 'ε' ? 'ε' : `'${transition.read}'`;
      const popStr = transition.pop === 'ε' ? 'ε' : transition.pop;
      const pushStr = transition.push === 'ε' ? 'ε' : transition.push;
      action = `${readStr}, ${popStr}/${pushStr} → ${currentState}`;
    }

    steps.push({
      index: steps.length,
      symbol: transition.read === 'ε' ? null : transition.read,
      state: currentState,
      currentState: currentState,
      stack: [...stack],
      action,
    });

    // Advance input cursor only if transition consumed a symbol
    if (transition.read !== 'ε') {
      pos++;
    }
    // If ε transition, stay on the same symbol
  }

  if (steps.length >= maxSteps) {
    return {
      accepted: false,
      steps,
      error: 'Simulation exceeded maximum step limit (possible infinite loop).',
    };
  }

  // Check acceptance by final state (AND empty stack — prevents false accepts)
  const finalState = machine.states.find((s) => s.id === currentState);
  const stackEmpty = stack.length === 0 || (stack.length === 1 && stack[0] === stackStart);
  const accepted = finalState ? finalState.accept && stackEmpty : false;

  return { accepted, steps };
}

/**
 * Find a matching transition.
 * Priority: exact symbol + exact pop > exact symbol + ε pop > ε read + exact pop > ε read + ε pop
 */
function findTransition(transitions, state, symbol, top) {
  const candidates = transitions.filter((t) => t.from === state);

  // Priority 1: exact symbol match + exact pop match
  let match = candidates.find(
    (t) => t.read === symbol && t.pop === top
  );
  if (match) return match;

  // Priority 2: exact symbol match + ε pop
  match = candidates.find(
    (t) => t.read === symbol && t.pop === 'ε'
  );
  if (match) return match;

  // Priority 3: ε read + exact pop match
  match = candidates.find(
    (t) => t.read === 'ε' && t.pop === top
  );
  if (match) return match;

  // Priority 4: ε read + ε pop
  match = candidates.find(
    (t) => t.read === 'ε' && t.pop === 'ε'
  );
  if (match) return match;

  // Priority 5: exact symbol match + any pop (for robustness)
  match = candidates.find((t) => t.read === symbol);
  if (match) return match;

  return null;
}
