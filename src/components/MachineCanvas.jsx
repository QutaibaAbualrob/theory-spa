import { perpOffset } from '../utils/graphLayout';

/**
 * MachineCanvas — SVG state graph renderer.
 *
 * Props:
 *   machine             — machine object { states, transitions }
 *   activeStates        — array of state IDs to highlight
 *   activeTransition    — { from, to } or null
 */
function MachineCanvas({ machine, activeStates = [], activeTransition = null }) {
  if (!machine || !machine.states || machine.states.length === 0) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 500 400" style={{ background: 'transparent' }}>
        <text x="250" y="200" textAnchor="middle" fill="#999" fontSize="14" fontFamily="monospace">
          No machine loaded
        </text>
      </svg>
    );
  }

  const { states, transitions } = machine;
  const activeSet = new Set(activeStates);
  const stateMap = new Map(states.map((s) => [s.id, s]));

  // Dynamic viewBox: fit all states with 60px padding
  const pad = 60;
  const xs = states.map((s) => s.x);
  const ys = states.map((s) => s.y);
  const minX = Math.min(...xs) - pad;
  const maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad;
  const maxY = Math.max(...ys) + pad;
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  // Group transitions by (from, to) pair
  const grouped = new Map();
  transitions.forEach((t) => {
    const key = `${t.from}::${t.to}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(t);
  });

  return (
    <svg width="100%" height="100%" viewBox={viewBox} style={{ background: 'transparent' }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#555" />
        </marker>
        <marker
          id="arrowhead-accent"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
        </marker>
        <filter id="glow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--accent)" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Edges */}
      {Array.from(grouped.entries()).map(([key, txns]) => {
        const [fromId, toId] = key.split('::');
        const fromState = stateMap.get(fromId);
        const toState = stateMap.get(toId);
        if (!fromState || !toState) return null;

        const isActive =
          activeTransition &&
          activeTransition.from === fromId &&
          activeTransition.to === toId;
        const edgeColor = isActive ? 'var(--accent)' : '#555';
        const markerId = isActive ? 'arrowhead-accent' : 'arrowhead';
        const strokeW = isActive ? 2.5 : 1.5;

        const symbols = txns
          .map((t) => (t.symbol === 'ε' ? 'ε' : t.symbol))
          .join(', ');

        // Calculate edge points from circle edges (r=28)
        const r = 28;
        const dx = toState.x - fromState.x;
        const dy = toState.y - fromState.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const startAngle = Math.atan2(dy, dx);
        const endAngle = Math.atan2(-dy, -dx);

        const sx = fromState.x + r * Math.cos(startAngle);
        const sy = fromState.y + r * Math.sin(startAngle);
        const ex = toState.x + r * Math.cos(endAngle);
        const ey = toState.y + r * Math.sin(endAngle);

        if (fromId === toId) {
          // Self-loop arc — cubic bezier so end tangent points INTO the circle
          const cx = fromState.x;
          const cy = fromState.y;
          return (
            <g key={key}>
              <path
                d={`M ${cx - 24} ${cy - 14} C ${cx - 40} ${cy - 50}, ${cx + 45} ${cy - 50}, ${cx + 22} ${cy - 14}`}
                fill="none"
                stroke={edgeColor}
                strokeWidth={strokeW}
                markerEnd={`url(#${markerId})`}
              />
              <text
                x={fromState.x}
                y={fromState.y - 65}
                textAnchor="middle"
                fill={isActive ? 'var(--accent)' : '#444'}
                fontSize={12}
                fontFamily="monospace"
              >
                {symbols}
              </text>
            </g>
          );
        }

        // Normal edge: quadratic bezier using perpOffset
        const cp = perpOffset(fromState, toState, 30);
        return (
          <g key={key}>
            <path
              d={`M ${sx} ${sy} Q ${cp.cx} ${cp.cy}, ${ex} ${ey}`}
              fill="none"
              stroke={edgeColor}
              strokeWidth={strokeW}
              markerEnd={`url(#${markerId})`}
            />
            <text
              x={cp.cx}
              y={cp.cy - 8}
              textAnchor="middle"
              fill={isActive ? 'var(--accent)' : '#444'}
              fontSize={12}
              fontFamily="monospace"
            >
              {symbols}
            </text>
          </g>
        );
      })}

      {/* States (render on top of edges) */}
      {states.map((state) => {
        const isActive = activeSet.has(state.id);
        const fillColor = isActive ? '#e3f2fd' : 'white';
        const strokeColor = isActive ? 'var(--accent)' : '#555';
        const strokeW = isActive ? 3 : 2;
        const filterVal = isActive ? 'url(#glow)' : undefined;

        return (
          <g key={state.id}>
            {/* Accept-state double border */}
            {state.accept && (
              <circle
                cx={state.x}
                cy={state.y}
                r={35}
                fill="none"
                stroke="#555"
                strokeWidth={2.5}
              />
            )}

            {/* Start-state arrow */}
            {state.start && (
              <g>
                <line
                  x1={state.x - 60}
                  y1={state.y}
                  x2={state.x - 36}
                  y2={state.y}
                  stroke="#555"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowhead)"
                />
              </g>
            )}

            {/* Main circle */}
            <circle
              cx={state.x}
              cy={state.y}
              r={28}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeW}
              filter={filterVal}
            />

            {/* State label */}
            <text
              x={state.x}
              y={state.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              fontFamily="monospace"
              fill="#1a1a2e"
            >
              {state.label || state.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default MachineCanvas;
