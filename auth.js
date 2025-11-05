import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db, uid } from './store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret-change-me';

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export async function signup(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  if (db.users.find(u => u.email === email)) return res.status(409).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: uid(), name, email, passwordHash: hash };
  db.users.push(user);
  const token = signToken(user);
  res.json({ token, user: { id: user.id, name, email } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid email or password' });
  const token = signToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}