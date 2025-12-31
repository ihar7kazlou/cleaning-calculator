import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import scenariosRouter from './routes/scenarios.js';
import runsRouter from './routes/runs.js';
import vapiRouter from './routes/vapi.js';
import cleaningRouter from './routes/cleaning.js';

const app = express();
app.use(cors());
app.use(json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/scenarios', scenariosRouter);
app.use('/api/runs', runsRouter);
app.use('/webhooks/vapi', vapiRouter);
app.use('/api/cleaning', cleaningRouter);

// Basic error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Avoid leaking internals
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});




