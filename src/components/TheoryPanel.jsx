/**
 * TheoryPanel — displays concept explanation and optional preset info.
 *
 * Props:
 *   theory   — { summary, howItWorks, keyConcepts, practiceTip }
 *   preset   — { title, description } | null
 */
function TheoryPanel({ theory, preset }) {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
      {/* Preset info */}
      {preset && (
        <div style={{ marginBottom: 16 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              margin: '0 0 4px 0',
              color: 'var(--text-primary)',
            }}
          >
            {preset.title}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {preset.description}
          </p>
        </div>
      )}

      {/* Theory content */}
      {theory && (
        <>
          {/* Summary */}
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {theory.summary}
          </p>

          {/* How It Works */}
          <h4
            style={{
              fontWeight: 600,
              fontSize: 13,
              marginTop: 16,
              marginBottom: 4,
              color: 'var(--text-primary)',
            }}
          >
            How It Works
          </h4>
          <ol style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)' }}>
            {theory.howItWorks.map((item, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </ol>

          {/* Key Concepts */}
          <h4
            style={{
              fontWeight: 600,
              fontSize: 13,
              marginTop: 16,
              marginBottom: 4,
              color: 'var(--text-primary)',
            }}
          >
            Key Concepts
          </h4>
          <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-secondary)' }}>
            {theory.keyConcepts.map((item, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </ul>

          {/* Practice Tip */}
          <div
            style={{
              background: '#f0f9ff',
              borderLeft: '3px solid var(--accent)',
              padding: '8px 12px',
              borderRadius: 4,
              fontSize: 12,
              marginTop: 12,
              color: 'var(--text-primary)',
            }}
          >
            💡 {theory.practiceTip}
          </div>
        </>
      )}
    </div>
  );
}

export default TheoryPanel;
