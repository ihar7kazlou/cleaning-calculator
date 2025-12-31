import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

// Схема валидации для расчета
const calculationSchema = z.object({
  serviceType: z.enum(['regular', 'deep', 'window', 'carpet', 'move_in_out', 'post_construction']),
  area: z.number().min(10).max(500),
  rooms: z.number().min(1).max(20),
  bathrooms: z.number().min(0).max(10),
  frequency: z.enum(['one_time', 'weekly', 'biweekly', 'monthly']),
  addWindowCleaning: z.boolean().default(false),
  addCarpetCleaning: z.boolean().default(false),
  baseCost: z.number(),
  windowCost: z.number().default(0),
  carpetCost: z.number().default(0),
  discount: z.number().default(0),
  totalCost: z.number(),
  userId: z.string().optional(),
});

// Сохранение расчета
router.post('/calculations', async (req, res) => {
  try {
    const data = calculationSchema.parse(req.body);
    const calculation = await prisma.cleaningCalculation.create({
      data,
    });
    res.status(201).json(calculation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid data', details: error.errors });
      return;
    }
    throw error;
  }
});

// Получение истории расчетов
router.get('/calculations', async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const userId = req.query.userId as string | undefined;

  const calculations = await prisma.cleaningCalculation.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  res.json(calculations);
});

// Получение конкретного расчета
router.get('/calculations/:id', async (req, res) => {
  const { id } = req.params;
  const calculation = await prisma.cleaningCalculation.findUnique({
    where: { id },
  });

  if (!calculation) {
    res.status(404).json({ error: 'Calculation not found' });
    return;
  }

  res.json(calculation);
});

// Удаление расчета
router.delete('/calculations/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.cleaningCalculation.delete({
    where: { id },
  });
  res.status(204).send();
});

// Статистика
router.get('/statistics', async (req, res) => {
  const totalCalculations = await prisma.cleaningCalculation.count();
  const totalRevenue = await prisma.cleaningCalculation.aggregate({
    _sum: { totalCost: true },
  });
  const avgCost = await prisma.cleaningCalculation.aggregate({
    _avg: { totalCost: true },
  });

  // Группировка по типам услуг
  const byServiceType = await prisma.cleaningCalculation.groupBy({
    by: ['serviceType'],
    _count: { serviceType: true },
    _avg: { totalCost: true },
  });

  res.json({
    totalCalculations,
    totalRevenue: totalRevenue._sum.totalCost || 0,
    averageCost: avgCost._avg.totalCost || 0,
    byServiceType: byServiceType.map(item => ({
      serviceType: item.serviceType,
      count: item._count.serviceType,
      averageCost: item._avg.totalCost,
    })),
  });
});

// Кэширование (простой in-memory кэш с возможностью сохранения в БД)
const cache = new Map<string, { value: any; expiresAt: number }>();

// Очистка устаревших записей кэша
setInterval(async () => {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (item.expiresAt < now) {
      cache.delete(key);
    }
  }

  // Очистка БД кэша
  await prisma.cleaningCache.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}, 60000); // Каждую минуту

// Получение из кэша
router.get('/cache/:key', async (req, res) => {
  const { key } = req.params;

  // Проверяем in-memory кэш
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    res.json({ value: cached.value, cached: true });
    return;
  }

  // Проверяем БД кэш
  const dbCache = await prisma.cleaningCache.findUnique({
    where: { key },
  });

  if (dbCache && dbCache.expiresAt > new Date()) {
    res.json({ value: JSON.parse(dbCache.value), cached: true });
    return;
  }

  res.status(404).json({ error: 'Cache not found' });
});

// Сохранение в кэш
router.post('/cache', async (req, res) => {
  const { key, value, ttl } = req.body; // ttl в секундах

  if (!key || value === undefined) {
    res.status(400).json({ error: 'Key and value are required' });
    return;
  }

  const ttlSeconds = ttl || 3600; // По умолчанию 1 час
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  // Сохраняем в in-memory кэш
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  // Сохраняем в БД кэш
  await prisma.cleaningCache.upsert({
    where: { key },
    update: {
      value: JSON.stringify(value),
      expiresAt,
    },
    create: {
      key,
      value: JSON.stringify(value),
      expiresAt,
    },
  });

  res.json({ success: true, expiresAt });
});

export default router;


