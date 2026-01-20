import express from 'express';
import fs from 'fs';
import Issue from '../models/Issue.js';
import User from '../models/User.js';
import { generateAdminReport } from '../utils/adminReportGenerator.js';

const router = express.Router();

router.get('/download-report', async (req, res) => {
  try {
    const issues = await Issue.find().populate('assignedTo', 'name');
    const users = await User.find();

    const filePath = await generateAdminReport({ issues, users });

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ message: 'Report file not found' });
    }

    res.download(filePath, 'Admin_Report.pdf');
  } catch (err) {
    console.error('Report download error:', err);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

export default router;
