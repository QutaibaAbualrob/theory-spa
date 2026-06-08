/**
 * PresetSelector — clickable list of preset machine cards.
 *
 * Props:
 *   presets            — array of preset objects
 *   currentPresetId    — id of the active preset (or null)
 *   onSelect           — (preset) => void
 */
function PresetSelector({ presets, currentPresetId, onSelect }) {
  return (
    <div style={{ marginTop: 16 }}>
      <h4
        style={{
          fontWeight: 600,
          fontSize: 13,
          margin: '0 0 8px 0',
          color: 'var(--text-primary)',
        }}
      >
        Presets
      </h4>
      {presets.map((preset) => {
        const isActive = preset.id === currentPresetId;
        return (
          <div
            key={preset.id}
            onClick={() => onSelect(preset)}
            style={{
              padding: 10,
              border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 6,
              marginBottom: 8,
              cursor: 'pointer',
              transition: 'border-color 0.15s, background 0.15s',
              background: isActive ? '#f8faff' : 'white',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.borderColor = 'var(--accent-hover)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
              {preset.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {preset.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PresetSelector;
