import { useReducer } from 'react';
import TapeView from '../../components/TapeView';
import TracePanel from '../../components/TracePanel';
import ResultBadge from '../../components/ResultBadge';
import TheoryPanel from '../../components/TheoryPanel';
import PresetSelector from '../../components/PresetSelector';
import { simulateTM } from './tmEngine';
import { tmPresets } from './tmPresets';
import { tmTheory } from './tmTheory';

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
      return { ...state, input: action.value };
    case 'RUN_DONE':
      return {
        ...state,
        trace: action.trace,
        accepted: action.accepted,
        error: action.error,
        currentStepIndex: action.lastStep,
        running: false,
      };
    case 'STEP_INIT':
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
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  View                                                              */
/* ------------------------------------------------------------------ */

function TMView() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { machine, input, trace, currentStepIndex, accepted, error, running } =
    state;

  /* ── Derived values ── */

  const currentTape =
    trace.length > 0 && trace[currentStepIndex]
      ? trace[currentStepIndex].tape || []
      : [];

  const currentHead =
    trace.length > 0 && trace[currentStepIndex]
      ? trace[currentStepIndex].head || 0
      : 0;

  const currentPreset = machine
    ? tmPresets.find((p) => p.id === machine.id) || null
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

    const result = simulateTM(machine, input);
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

    if (trace.length === 0) {
      const result = simulateTM(machine, input);
      dispatch({
        type: 'STEP_INIT',
        trace: result.steps,
        error: result.error,
      });
      return;
    }

    const next = currentStepIndex + 1;
    if (next <= trace.length - 1) {
      const result = simulateTM(machine, input);
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
      ? tmPresets.findIndex((p) => p.id === machine.id)
      : -1;
    const nextIdx = (currentIdx + 1) % tmPresets.length;
    loadPreset(tmPresets[nextIdx]);
  }

  /* ── Render ── */

  return (
    <>
      {/* Left Panel */}
      <div className="left-panel">
        <TheoryPanel theory={tmTheory} preset={currentPreset} />
        <PresetSelector
          presets={tmPresets}
          currentPresetId={machine?.id}
          onSelect={loadPreset}
        />
      </div>

      {/* Center Panel — TapeView instead of MachineCanvas */}
      <div className="center-panel" style={{ position: 'relative' }}>
        {machine ? (
          <div style={{ width: '100%', padding: '24px 16px' }}>
            <TapeView tape={currentTape} head={currentHead} />
          </div>
        ) : (
          <div className="panel-placeholder">
            Select a TM preset to begin.
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <ResultBadge accepted={accepted} />
        {error && (
          <div className="error-message" style={{ marginTop: 8 }}>
            {error}
          </div>
        )}
        {trace.length > 0 && trace[currentStepIndex] && (
          <div
            style={{
              fontSize: 12,
              background: '#f0f4ff',
              padding: '8px 12px',
              borderRadius: 6,
            }}
          >
            <strong>State:</strong> {trace[currentStepIndex].state} &nbsp;|&nbsp;{' '}
            <strong>Head:</strong> position {trace[currentStepIndex].head}
          </div>
        )}
        <div style={{ flex: 1, minHeight: 0 }}>
          <h4 className="panel-heading">Trace</h4>
          <TracePanel
            steps={trace}
            accepted={accepted}
            currentStepIndex={currentStepIndex}
          />
        </div>
      </div>

      {/* Control Bar */}
      <div className="control-bar" style={{ gridColumn: '1 / -1' }}>
        <input
          type="text"
          placeholder="Enter binary addition (e.g., 101+11)..."
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

export default TMView;
