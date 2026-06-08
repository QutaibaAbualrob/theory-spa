import { useReducer, useEffect } from 'react';
import MachineCanvas from '../../components/MachineCanvas';
import TheoryPanel from '../../components/TheoryPanel';
import { gnfaPresets } from './gnfaPresets';
import { gnfaTheory } from './gnfaTheory';

/* ------------------------------------------------------------------ */
/*  State                                                             */
/* ------------------------------------------------------------------ */

const initialState = {
  machine: null,
  currentStepIndex: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_PRESET':
      return {
        machine: action.preset,
        currentStepIndex: 0,
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStepIndex: action.index,
      };
    case 'RESET':
      return {
        ...state,
        currentStepIndex: 0,
      };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  View                                                              */
/* ------------------------------------------------------------------ */

function GNFAView() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { machine, currentStepIndex } = state;

  const currentPreset = machine
    ? gnfaPresets.find((p) => p.id === machine.id) || null
    : null;

  /* ── Handlers ── */

  function loadPreset(preset) {
    dispatch({ type: 'LOAD_PRESET', preset });
  }

  /* ── Auto-load first preset on mount ── */

  useEffect(() => {
    if (!machine) loadPreset(gnfaPresets[0]);
  }, []);

  /* ── Render ── */

  return (
    <>
      {/* Left Panel */}
      <div className="left-panel">
        <TheoryPanel theory={gnfaTheory} preset={currentPreset} />
      </div>

      {/* Center Panel */}
      <div className="center-panel" style={{ position: 'relative' }}>
        <MachineCanvas
          machine={machine}
          activeStates={[]}
          activeTransition={null}
        />
      </div>

      {/* Right Panel — Elimination Steps */}
      <div className="right-panel">
        <h4 className="panel-heading">Elimination Steps</h4>
        {currentPreset && currentPreset.eliminationSteps ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentPreset.eliminationSteps.map((step, i) => (
              <div
                key={i}
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: `1px solid ${
                    i === currentStepIndex ? 'var(--accent)' : 'var(--border)'
                  }`,
                  background:
                    i === currentStepIndex ? '#f8faff' : 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onClick={() =>
                  dispatch({ type: 'SET_STEP', index: i })
                }
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 12,
                    marginBottom: 4,
                    color: 'var(--text-primary)',
                  }}
                >
                  {i + 1}. {step.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {step.description}
                </div>
                {step.formula && (
                  <div
                    style={{
                      marginTop: 6,
                      padding: '6px 8px',
                      background: '#f0f4ff',
                      borderRadius: 4,
                      fontFamily: 'monospace',
                      fontSize: 11,
                      color: 'var(--accent)',
                    }}
                  >
                    {step.formula}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Select a preset to see elimination steps.
          </div>
        )}
      </div>

      {/* No control bar — GNFA is read-only */}
    </>
  );
}

export default GNFAView;
