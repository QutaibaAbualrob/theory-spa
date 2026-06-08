import { useState } from 'react';
import Header from './components/Header';
import TopTabs from './components/TopTabs';
import DFAView from './modules/dfa/DFAView';
import NFAView from './modules/nfa/NFAView';
import PDAView from './modules/pda/PDAView';
import TMView from './modules/tm/TMView';

const TABS = ['DFA', 'NFA', 'PDA', 'TM Addition', 'GNFA'];

function Placeholder({ title }) {
  return (
    <>
      <div className="left-panel">
        <h3 className="panel-heading">{title}</h3>
        <p className="text-secondary">Coming soon.</p>
      </div>
      <div className="center-panel">
        <div className="panel-placeholder">
          {title} visualization will appear here.
        </div>
      </div>
      <div className="right-panel">
        <div className="panel-placeholder">Trace will appear here.</div>
      </div>
    </>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('DFA');

  return (
    <div className="app-container">
      <Header />
      <TopTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'DFA' && <DFAView />}
        {activeTab === 'NFA' && <NFAView />}
        {activeTab === 'PDA' && <PDAView />}
        {activeTab === 'TM Addition' && <TMView />}
        {activeTab === 'GNFA' && <Placeholder title="GNFA" />}
      </main>
    </div>
  );
}

export default App;
