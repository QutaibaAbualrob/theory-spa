/**
 * ResultBadge — pill showing simulation result.
 *
 * Props:
 *   accepted   — null | true | false
 */
function ResultBadge({ accepted }) {
  let label, bg;

  if (accepted === true) {
    label = 'Accepted';
    bg = 'var(--success)';
  } else if (accepted === false) {
    label = 'Rejected';
    bg = 'var(--error)';
  } else {
    label = 'Ready';
    bg = '#adb5bd';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 12,
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 600,
        color: 'white',
        backgroundColor: bg,
        alignSelf: 'flex-start',
      }}
    >
      {accepted === true ? '✓ ' : accepted === false ? '✗ ' : '— '}
      {label}
    </span>
  );
}

export default ResultBadge;
