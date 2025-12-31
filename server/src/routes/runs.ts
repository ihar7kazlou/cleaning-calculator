import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  const runs = await prisma.run.findMany({ include: { scenario: true, trainee: true } });
  res.json(runs);
});

const createRunSchema = z.object({
  traineeId: z.string(),
  scenarioId: z.string(),
  mode: z.enum(['CHAT', 'VOICE']).default('CHAT')
});

router.post('/', async (req, res) => {
  const data = createRunSchema.parse(req.body);
  const run = await prisma.run.create({
    data: {
      traineeId: data.traineeId,
      scenarioId: data.scenarioId,
      mode: data.mode,
      status: 'PENDING'
    }
  });

  // TODO: Start VAPI session asynchronously; store any session IDs
  res.status(201).json(run);
});

router.get('/:id', async (req, res) => {
  const run = await prisma.run.findUnique({ where: { id: req.params.id } });
  if (!run) return res.status(404).json({ error: 'Not found' });
  res.json(run);
});

export default router;




