import express from 'express';
import AdminLog from '../models/AdminLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {

    const logs = await AdminLog.find().sort({ timestamp: -1 }).limit(100); // safety limit

    return res.json(logs);
  } catch (err) {
    console.error('Fetch admin logs error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
