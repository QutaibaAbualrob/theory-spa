/**
 * StackView — vertical PDA stack visualization.
 *
 * Props:
 *   stack   — array of strings (top of stack = last element)
 */
function StackView({ stack }) {
  if (!stack || stack.length === 0) {
    return (
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        Stack will appear here.
      </div>
    );
  }

  return (
    <div>
      <h4 className="panel-heading" style={{ marginBottom: 8 }}>Stack</h4>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: 4,
          alignItems: 'flex-start',
          minHeight: 100,
        }}
      >
        {stack.map((sym, i) => (
          <div
            key={i}
            style={{
              width: 48,
              height: 32,
              border: `1px solid ${i === stack.length - 1 ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: 14,
              fontWeight: i === stack.length - 1 ? 700 : 400,
              background: i === stack.length - 1 ? '#f0f4ff' : 'white',
            }}
          >
            {sym}
          </div>
        ))}
      </div>
      {stack.length > 0 && (
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
          ↑ top
        </div>
      )}
    </div>
  );
}

export default StackView;
