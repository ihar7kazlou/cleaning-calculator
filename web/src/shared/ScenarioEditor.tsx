import { useState } from 'react';

type NodeDraft = { id?: string; prompt: string; hint?: string; edgesJson: string };
type RubricDraft = { id?: string; label: string; weight: number; ruleJson?: string };

export default function ScenarioEditor({ scenario, onSaved, onClose }: { scenario: any; onSaved: (s: any) => void; onClose: () => void; }) {
  const [title, setTitle] = useState<string>(scenario.title || '');
  const [description, setDescription] = useState<string>(scenario.description || '');
  const [nodes, setNodes] = useState<NodeDraft[]>(scenario.nodes || []);
  const [rubricItems, setRubricItems] = useState<RubricDraft[]>(scenario.rubricItems || []);

  async function save() {
    const payload = { title, description, nodes, rubricItems };
    const isNew = !scenario.id;
    const res = await fetch(isNew ? '/api/scenarios' : `/api/scenarios/${scenario.id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const saved = await res.json();
    onSaved(saved);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{scenario.id ? 'Edit Scenario' : 'New Scenario'}</h3>
        <button className="text-sm" onClick={onClose}>Close</button>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Title</span>
          <input className="border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Description</span>
          <textarea className="border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Dialog Nodes</h4>
          <button className="text-sm border rounded px-2 py-1" onClick={() => setNodes(prev => [{ prompt: '', hint: '', edgesJson: '[]' }, ...prev])}>Add Node</button>
        </div>
        <div className="grid gap-3">
          {nodes.map((n, i) => (
            <div key={i} className="border rounded p-3 grid gap-2 bg-gray-50">
              <input className="border rounded px-3 py-2" placeholder="Prompt" value={n.prompt} onChange={e => setNodes(prev => prev.map((p, j) => j===i ? { ...p, prompt: e.target.value } : p))} />
              <input className="border rounded px-3 py-2" placeholder="Hint (optional)" value={n.hint || ''} onChange={e => setNodes(prev => prev.map((p, j) => j===i ? { ...p, hint: e.target.value } : p))} />
              <textarea className="border rounded px-3 py-2 text-xs" placeholder='Edges JSON (e.g., [{"label":"ask budget","toNodeId":"..."}])' value={n.edgesJson} onChange={e => setNodes(prev => prev.map((p, j) => j===i ? { ...p, edgesJson: e.target.value } : p))} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Rubric</h4>
          <button className="text-sm border rounded px-2 py-1" onClick={() => setRubricItems(prev => [{ label: '', weight: 1 }, ...prev])}>Add Criterion</button>
        </div>
        <div className="grid gap-3">
          {rubricItems.map((r, i) => (
            <div key={i} className="border rounded p-3 grid gap-2 bg-gray-50">
              <input className="border rounded px-3 py-2" placeholder="Label" value={r.label} onChange={e => setRubricItems(prev => prev.map((p, j) => j===i ? { ...p, label: e.target.value } : p))} />
              <input type="number" className="border rounded px-3 py-2" placeholder="Weight" value={r.weight} onChange={e => setRubricItems(prev => prev.map((p, j) => j===i ? { ...p, weight: Number(e.target.value) } : p))} />
              <textarea className="border rounded px-3 py-2 text-xs" placeholder='Rule JSON (optional)' value={r.ruleJson || ''} onChange={e => setRubricItems(prev => prev.map((p, j) => j===i ? { ...p, ruleJson: e.target.value } : p))} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button className="px-3 py-2 border rounded" onClick={onClose}>Cancel</button>
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={save}>Save</button>
      </div>
    </div>
  );
}





