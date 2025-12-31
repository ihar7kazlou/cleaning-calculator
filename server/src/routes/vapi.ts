import { Router } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

function verifySignature(rawBody: string, signature: string | undefined, secret: string | undefined): boolean {
  if (!signature || !secret) return false;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody, 'utf8');
  const digest = `sha256=${hmac.digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

// For raw body verification, mount this router with a raw body parser if required by VAPI
router.post('/', async (req, res) => {
  try {
    const event = req.body as any;

    // Optionally verify signature if VAPI provides one
    // const signature = req.header('x-vapi-signature');
    // const ok = verifySignature(JSON.stringify(event), signature, process.env.VAPI_WEBHOOK_SECRET);
    // if (!ok) return res.status(401).json({ error: 'Invalid signature' });

    // Expect event to include: runId, transcript, metrics, status
    const runId = event.runId as string | undefined;
    if (!runId) return res.status(400).json({ error: 'Missing runId' });

    const status = event.status === 'completed' ? 'COMPLETED' : event.status === 'failed' ? 'FAILED' : 'IN_PROGRESS';

    await prisma.run.update({
      where: { id: runId },
      data: {
        transcript: event.transcript ? JSON.stringify(event.transcript) : undefined,
        metricsJson: event.metrics ? JSON.stringify(event.metrics) : undefined,
        status
      }
    });

    // Optionally compute score now (or via background job)
    // await scoreRun(runId)

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Webhook error' });
  }
});

export default router;




