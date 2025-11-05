import { db, uid, EventStatus } from './store.js';

export function listMine(req, res) {
  const userId = req.user.id;
  const rows = db.events
    .filter(e => e.ownerId === userId)
    .sort((a,b) => new Date(a.startTime) - new Date(b.startTime));
  res.json(rows);
}

export function create(req, res) {
  const { title, startTime, endTime } = req.body;
  if (!title || !startTime || !endTime) return res.status(400).json({ message: 'title, startTime, endTime required' });
  const event = { id: uid(), title, startTime, endTime, status: EventStatus.BUSY, ownerId: req.user.id };
  db.events.push(event);
  res.status(201).json(event);
}

export function update(req, res) {
  const id = req.params.id;
  const e = db.events.find(x => x.id === id);
  if (!e || e.ownerId !== req.user.id) return res.status(404).json({ message: 'Not found' });
  const { title, startTime, endTime, status } = req.body;
  if (title !== undefined) e.title = title;
  if (startTime !== undefined) e.startTime = startTime;
  if (endTime !== undefined) e.endTime = endTime;
  if (status !== undefined) e.status = status;
  res.json(e);
}

export function remove(req, res) {
  const id = req.params.id;
  const index = db.events.findIndex(x => x.id === id && x.ownerId === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });
  db.events.splice(index, 1);
  res.status(204).send();
}

export function makeSwappable(req, res) {
  const id = req.params.id;
  const e = db.events.find(x => x.id === id);
  if (!e || e.ownerId !== req.user.id) return res.status(404).json({ message: 'Not found' });
  if (e.status === EventStatus.SWAP_PENDING) return res.status(400).json({ message: 'Pending swap' });
  e.status = EventStatus.SWAPPABLE;
  res.json(e);
}