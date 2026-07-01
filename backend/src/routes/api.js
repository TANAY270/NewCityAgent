import express from 'express';
import { db } from '../db/postgres.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Users
router.post('/users', async (req, res, next) => {
  try {
    const { name, phone, persona } = req.body;
    const result = await db.query(
      'INSERT INTO users (name, phone, persona) VALUES ($1, $2, $3) RETURNING *',
      [name, phone, persona]
    );
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 20');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Signals
let clients = [];

router.get('/signals/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  
  clients.push(res);
  
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

router.get('/signals', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM signals ORDER BY timestamp DESC LIMIT 20');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/signals', async (req, res, next) => {
  try {
    const { signal_type, location } = req.body;
    const result = await db.query(
      'INSERT INTO signals (signal_type, location) VALUES ($1, $2) RETURNING *',
      [signal_type, location]
    );
    const newSignal = result.rows[0];
    clients.forEach(client => client.write(`data: ${JSON.stringify(newSignal)}\n\n`));
    res.json(newSignal);
  } catch (error) {
    next(error);
  }
});

export default router;
