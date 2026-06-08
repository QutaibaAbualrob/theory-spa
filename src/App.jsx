import { useState } from 'react';
import Header from './components/Header';
import TopTabs from './components/TopTabs';
import ControlBar from './components/ControlBar';

const TABS = ['DFA', 'NFA', 'PDA', 'TM Addition', 'GNFA'];

function App() {
  const [activeTab, setActiveTab] = useState('DFA');
  const [input, setInput] = useState('');

  return (
    <div className="app-container">
      <Header />
      <TopTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="main-content">
        <aside className="left-panel">
          <p className="panel-placeholder">
            Select a module above and load a preset to begin.
          </p>
        </aside>

        <main className="center-panel">
          <p className="panel-placeholder">
            Machine visualization will appear here.
          </p>
        </main>

        <aside className="right-panel">
          <p className="panel-placeholder">
            Execution trace will appear here.
          </p>
        </aside>
      </div>

      <ControlBar
        input={input}
        onInputChange={(e) => setInput(e.target.value)}
        onRun={() => {}}
        onStep={() => {}}
        onReset={() => {}}
        onLoadExample={() => {}}
        running={false}
      />
    </div>
  );
}

export default App;
