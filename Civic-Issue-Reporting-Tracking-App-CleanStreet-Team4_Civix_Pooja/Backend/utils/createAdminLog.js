import AdminLog from '../models/AdminLog.js';

export const createAdminLog = async ({ userId, message }) => {
  try {
    await AdminLog.create({
      user_id: userId,
      action: message,
    });
  } catch (err) {
    console.error('Admin log error:', err.message);
  }
};
