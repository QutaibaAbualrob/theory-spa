function ControlBar({
  input,
  onInputChange,
  onRun,
  onStep,
  onReset,
  onLoadExample,
  running,
}) {
  return (
    <div className="control-bar">
      <input
        type="text"
        placeholder="Enter input string..."
        value={input}
        onChange={onInputChange}
      />
      <button
        className="btn btn-primary"
        onClick={onRun}
        disabled={running || input.trim() === ''}
      >
        Run
      </button>
      <button className="btn btn-secondary" onClick={onStep} disabled={running}>
        Step
      </button>
      <button className="btn btn-secondary" onClick={onReset} disabled={running}>
        Reset
      </button>
      <button
        className="btn btn-secondary"
        onClick={onLoadExample}
        disabled={running}
      >
        Load Example
      </button>
    </div>
  );
}

export default ControlBar;
