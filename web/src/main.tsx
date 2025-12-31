import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles.css';
import App from './App';
import AdminScenarios from './pages/AdminScenarios';
import RunSimulation from './pages/RunSimulation';
import CleaningCalculator from './pages/CleaningCalculator';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/admin/scenarios', element: <AdminScenarios /> },
  { path: '/run', element: <RunSimulation /> },
  { path: '/cleaning-calculator', element: <CleaningCalculator /> }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);




