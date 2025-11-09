import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const adminAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
