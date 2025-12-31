import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Sales Trainer</h1>
          <nav className="flex gap-4 text-sm">
            <Link to="/">Home</Link>
            <Link to="/admin/scenarios">Admin</Link>
            <Link to="/run">Run Simulation</Link>
            <Link to="/cleaning-calculator">Калькулятор уборки</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome</h2>
        <p className="text-gray-600">Create branching scenarios, run simulations, and get feedback.</p>
      </main>
    </div>
  );
}




