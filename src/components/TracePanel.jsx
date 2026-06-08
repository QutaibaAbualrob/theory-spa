/**
 * TracePanel — scrollable list of simulation steps.
 *
 * Props:
 *   steps              — array of step objects from engine
 *   accepted           — boolean | null
 *   currentStepIndex   — which step is highlighted
 */
function TracePanel({ steps, accepted, currentStepIndex }) {
  if (!steps || steps.length === 0) {
    return (
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', padding: '16px 0' }}>
        Run a simulation to see the trace.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, fontSize: 12 }}>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '40px 60px 1fr',
          fontWeight: 600,
          padding: '4px 0',
          borderBottom: '2px solid var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        <span>Step</span>
        <span>Symbol</span>
        <span>State(s)</span>
      </div>

      {/* Steps — let parent panel scroll, no fixed height */}
      <div>
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const stateStr = step.currentStates
            ? step.currentStates.join(', ')
            : step.currentState || '—';

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 60px 1fr',
                padding: '4px 0',
                borderBottom: '1px solid var(--border)',
                backgroundColor: isCurrent ? '#f0f4ff' : 'transparent',
                fontFamily: isCurrent ? 'monospace' : 'inherit',
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              <span>{step.index}</span>
              <span>{step.symbol || '—'}</span>
              <span style={{ wordBreak: 'break-all' }}>{stateStr}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TracePanel;
