import { useReducer } from 'react';
import MachineCanvas from '../../components/MachineCanvas';
import TracePanel from '../../components/TracePanel';
import ResultBadge from '../../components/ResultBadge';
import TheoryPanel from '../../components/TheoryPanel';
import PresetSelector from '../../components/PresetSelector';
import { simulateDFA, validateDFA } from './dfaEngine';
import { dfaPresets } from './dfaPresets';
import { dfaTheory } from './dfaTheory';

/* ------------------------------------------------------------------ */
/*  State                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  machine: null,
  input: '',
  trace: [],
  currentStepIndex: 0,
  accepted: null,
  error: null,
  running: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_PRESET':
      return {
        ...initialState,
        machine: action.preset,
        input:
          action.preset.sampleInputs && action.preset.sampleInputs.length > 0
            ? action.preset.sampleInputs[0]
            : '',
      };
    case 'SET_INPUT':
      return { ...state, input: action.value, trace: [], currentStepIndex: 0, accepted: null, error: null };
    case 'RUN_DONE':
      return {
        ...state,
        trace: action.trace,
        accepted: action.accepted,
        error: action.error,
        currentStepIndex: action.lastStep,
        running: false,
      };
    case 'STEP_INIT': // first step — store full trace, show step 0
      return {
        ...state,
        trace: action.trace,
        error: action.error,
        currentStepIndex: 0,
        running: false,
        accepted: null,
      };
    case 'STEP_ADVANCE':
      return {
        ...state,
        currentStepIndex: action.index,
        accepted:
          action.index === action.lastStep ? action.result : null,
      };
    case 'RESET':
      return {
        ...state,
        currentStepIndex: 0,
        accepted: null,
        error: null,
      };
    case 'SET_RUNNING':
      return { ...state, running: true };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  View                                                              */
/* ------------------------------------------------------------------ */

function DFAView() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { machine, input, trace, currentStepIndex, accepted, error, running } =
    state;

  /* ── Derived values ── */

  const activeStates =
    trace.length > 0 && trace[currentStepIndex]
      ? trace[currentStepIndex].currentState != null
        ? [trace[currentStepIndex].currentState]
        : []
      : [];

  // Transition highlighted during stepping: from state N-1 → state N
  const activeTransition =
    trace.length > 0 && currentStepIndex > 0 && trace[currentStepIndex - 1]
      ? {
          from: trace[currentStepIndex - 1].currentState,
          to: trace[currentStepIndex].currentState,
        }
      : null;

  const currentPreset = machine
    ? dfaPresets.find((p) => p.id === machine.id) || null
    : null;

  /* ── Handlers ── */

  function loadPreset(preset) {
    dispatch({ type: 'LOAD_PRESET', preset });
  }

  function handleInputChange(e) {
    dispatch({ type: 'SET_INPUT', value: e.target.value });
  }

  function handleRun() {
    if (!machine || !input) return;

    const validation = validateDFA(machine);
    if (!validation.valid) {
      dispatch({
        type: 'RUN_DONE',
        trace: [],
        accepted: false,
        error: validation.errors.join(' '),
        lastStep: 0,
      });
      return;
    }

    const result = simulateDFA(machine, input);
    dispatch({
      type: 'RUN_DONE',
      trace: result.steps,
      accepted: result.accepted,
      error: result.error,
      lastStep: result.steps.length - 1,
    });
  }

  function handleStep() {
    if (!machine || !input) return;

    // If no trace yet, run the full simulation but only show step 0
    if (trace.length === 0) {
      const validation = validateDFA(machine);
      if (!validation.valid) {
        dispatch({
          type: 'STEP_INIT',
          trace: [],
          error: validation.errors.join(' '),
        });
        return;
      }

      const result = simulateDFA(machine, input);
      dispatch({
        type: 'STEP_INIT',
        trace: result.steps,
        error: result.error,
      });
      return;
    }

    // Advance one step if not at the end
    const next = currentStepIndex + 1;
    if (next <= trace.length - 1) {
      const result = simulateDFA(machine, input);
      dispatch({
        type: 'STEP_ADVANCE',
        index: next,
        lastStep: trace.length - 1,
        result: result.accepted,
      });
    }
  }

  function handleReset() {
    dispatch({ type: 'RESET' });
  }

  function handleLoadExample() {
    const currentIdx = machine
      ? dfaPresets.findIndex((p) => p.id === machine.id)
      : -1;
    const nextIdx = (currentIdx + 1) % dfaPresets.length;
    loadPreset(dfaPresets[nextIdx]);
  }

  /* ── Render ── */

  return (
    <>
      {/* Left Panel */}
      <div className="left-panel">
        <TheoryPanel theory={dfaTheory} preset={currentPreset} />
        <PresetSelector
          presets={dfaPresets}
          currentPresetId={machine?.id}
          onSelect={loadPreset}
        />
      </div>

      {/* Center Panel */}
      <div className="center-panel" style={{ position: 'relative' }}>
        <MachineCanvas
          machine={machine}
          activeStates={activeStates}
          activeTransition={activeTransition}
        />
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <ResultBadge accepted={accepted} />
        {error && (
          <div className="error-message" style={{ marginTop: 8 }}>
            {error}
          </div>
        )}
        <div style={{ flex: 1, minHeight: 0 }}>
          <TracePanel
            steps={trace}
            accepted={accepted}
            currentStepIndex={currentStepIndex}
          />
        </div>
      </div>

      {/* Control Bar (embedded in the module) */}
      <div className="control-bar" style={{ gridColumn: '1 / -1' }}>
        <input
          type="text"
          placeholder="Enter input string..."
          value={input}
          onChange={handleInputChange}
        />
        <button
          className="btn btn-primary"
          onClick={handleRun}
          disabled={!input || running}
        >
          Run
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleStep}
          disabled={!machine || running}
        >
          Step
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={!machine}
        >
          Reset
        </button>
        <button className="btn btn-secondary" onClick={handleLoadExample}>
          Load Example
        </button>
      </div>
    </>
  );
}

export default DFAView;
