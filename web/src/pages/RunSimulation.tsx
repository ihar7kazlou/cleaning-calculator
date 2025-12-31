import { useEffect, useState } from 'react';

type Scenario = { id: string; title: string };

export default function RunSimulation() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioId, setScenarioId] = useState('');
  const [mode, setMode] = useState<'CHAT' | 'VOICE'>('CHAT');
  const [runId, setRunId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/scenarios').then(r => r.json()).then((all) => setScenarios(all.map((s: any) => ({ id: s.id, title: s.title })))).catch(() => setScenarios([]));
  }, []);

  async function startRun() {
    // TODO integrate auth; using placeholder traineeId
    const traineeId = 'placeholder-trainee';
    const res = await fetch('/api/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ traineeId, scenarioId, mode })
    });
    const run = await res.json();
    setRunId(run.id);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h2 className="text-2xl font-semibold mb-4">Run Simulation</h2>
      <div className="bg-white border rounded p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Scenario</label>
          <select className="w-full border rounded px-3 py-2" value={scenarioId} onChange={e => setScenarioId(e.target.value)}>
            <option value="">Select scenario...</option>
            {scenarios.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2"><input type="radio" checked={mode==='CHAT'} onChange={() => setMode('CHAT')} /> Chat</label>
          <label className="flex items-center gap-2"><input type="radio" checked={mode==='VOICE'} onChange={() => setMode('VOICE')} /> Voice</label>
        </div>
        <button disabled={!scenarioId} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50" onClick={startRun}>Start</button>
        {runId && <div className="text-sm text-gray-700">Run started: {runId}</div>}
      </div>
    </div>
  );
}





