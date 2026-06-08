/**
 * TapeView — horizontal TM tape visualization with head indicator.
 *
 * Props:
 *   tape   — array of tape cell symbols
 *   head   — index of the current head position
 */
function TapeView({ tape, head }) {
  if (!tape || tape.length === 0) {
    return (
      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
        Tape will appear here.
      </div>
    );
  }

  return (
    <div>
      <h4 className="panel-heading" style={{ marginBottom: 8 }}>Tape</h4>
      {/* Head indicator row */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 2, minHeight: 18, paddingLeft: head * 38 }}>
        <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>▼</div>
      </div>
      {/* Tape cells */}
      <div style={{ display: 'flex', gap: 2, overflowX: 'auto', paddingBottom: 4 }}>
        {tape.map((cell, i) => (
          <div
            key={i}
            style={{
              width: 36,
              height: 36,
              border: `1px solid ${i === head ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: 14,
              fontWeight: 600,
              background: i === head ? '#e3f2fd' : 'white',
            }}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TapeView;
