import { useEffect, useState } from 'react';
import ScenarioEditor from '../shared/ScenarioEditor';

type Scenario = {
  id: string;
  title: string;
  description?: string;
};

export default function AdminScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [editing, setEditing] = useState<Scenario | null>(null);

  useEffect(() => {
    fetch('/api/scenarios').then(r => r.json()).then(setScenarios).catch(() => setScenarios([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Scenarios</h2>
        <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded" onClick={() => setEditing({ id: '', title: '', description: '' })}>
          New Scenario
        </button>
      </div>

      <ul className="space-y-2">
        {scenarios.map(s => (
          <li key={s.id} className="bg-white border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.title}</div>
              {s.description && <div className="text-sm text-gray-600">{s.description}</div>}
            </div>
            <button className="text-sm px-3 py-2 border rounded" onClick={() => setEditing(s)}>Edit</button>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white rounded shadow-lg w-full max-w-3xl p-4">
            <ScenarioEditor scenario={editing} onClose={() => setEditing(null)} onSaved={(s) => {
              setEditing(null);
              setScenarios(prev => {
                const i = prev.findIndex(p => p.id === s.id);
                if (i >= 0) {
                  const next = [...prev];
                  next[i] = s;
                  return next;
                }
                return [s, ...prev];
              });
            }} />
          </div>
        </div>
      )}
    </div>
  );
}





