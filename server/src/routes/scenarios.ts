import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  const scenarios = await prisma.scenario.findMany({
    include: { rubricItems: true, nodes: true }
  });
  res.json(scenarios);
});

const upsertSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  nodes: z.array(
    z.object({
      id: z.string().optional(),
      prompt: z.string().min(1),
      hint: z.string().optional(),
      edgesJson: z.string().default('[]')
    })
  ).default([]),
  rubricItems: z.array(
    z.object({ id: z.string().optional(), label: z.string().min(1), weight: z.number().int().min(0), ruleJson: z.string().optional() })
  ).default([]),
  rootNodeId: z.string().optional()
});

router.post('/', async (req, res) => {
  const data = upsertSchema.parse(req.body);
  const scenario = await prisma.scenario.create({
    data: {
      title: data.title,
      description: data.description,
      rootNodeId: data.rootNodeId,
      nodes: { create: data.nodes.map(n => ({ prompt: n.prompt, hint: n.hint, edgesJson: n.edgesJson })) },
      rubricItems: { create: data.rubricItems.map(r => ({ label: r.label, weight: r.weight, ruleJson: r.ruleJson })) }
    },
    include: { nodes: true, rubricItems: true }
  });
  res.status(201).json(scenario);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const data = upsertSchema.parse(req.body);

  await prisma.dialogNode.deleteMany({ where: { scenarioId: id } });
  await prisma.rubricItem.deleteMany({ where: { scenarioId: id } });

  const scenario = await prisma.scenario.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      rootNodeId: data.rootNodeId,
      nodes: { create: data.nodes.map(n => ({ prompt: n.prompt, hint: n.hint, edgesJson: n.edgesJson })) },
      rubricItems: { create: data.rubricItems.map(r => ({ label: r.label, weight: r.weight, ruleJson: r.ruleJson })) }
    },
    include: { nodes: true, rubricItems: true }
  });
  res.json(scenario);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await prisma.scenario.delete({ where: { id } });
  res.status(204).send();
});

export default router;





