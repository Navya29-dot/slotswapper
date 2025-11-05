import { db, uid, EventStatus, SwapStatus } from './store.js';

export function listOthersSwappable(req, res) {
  const userId = req.user.id;
  const rows = db.events
    .filter(e => e.ownerId !== userId && e.status === EventStatus.SWAPPABLE)
    .sort((a,b) => new Date(a.startTime) - new Date(b.startTime));
  res.json(rows);
}

export function listRequests(req, res) {
  const uid_ = req.user.id;
  const incoming = db.swaps.filter(s => s.toUserId === uid_);
  const outgoing = db.swaps.filter(s => s.fromUserId === uid_);
  const inflate = s => ({
    ...s,
    fromEvent: db.events.find(e => e.id === s.fromEventId),
    toEvent: db.events.find(e => e.id === s.toEventId)
  });
  res.json({ incoming: incoming.map(inflate), outgoing: outgoing.map(inflate) });
}

export function createSwapRequest(req, res) {
  const userId = req.user.id;
  const { mySlotId, theirSlotId } = req.body;
  const mine = db.events.find(e => e.id === mySlotId);
  const theirs = db.events.find(e => e.id === theirSlotId);

  if (!mine || !theirs) return res.status(404).json({ message: 'Event not found' });
  if (mine.ownerId !== userId) return res.status(403).json({ message: 'Cannot offer event you do not own' });
  if (theirs.ownerId === userId) return res.status(400).json({ message: 'Cannot swap with yourself' });
  if (mine.status !== EventStatus.SWAPPABLE || theirs.status !== EventStatus.SWAPPABLE) {
    return res.status(400).json({ message: 'Both events must be SWAPPABLE' });
  }

  const request = { id: uid(), status: SwapStatus.PENDING, fromUserId: userId, fromEventId: mine.id, toUserId: theirs.ownerId, toEventId: theirs.id };
  db.swaps.push(request);
  mine.status = EventStatus.SWAP_PENDING;
  theirs.status = EventStatus.SWAP_PENDING;

  res.status(201).json(request);
}

export function respondToSwap(req, res) {
  const userId = req.user.id;
  const { requestId } = req.params;
  const { accept } = req.body;

  const r = db.swaps.find(s => s.id === requestId);
  if (!r) return res.status(404).json({ message: 'Request not found' });
  if (r.toUserId !== userId) return res.status(403).json({ message: 'Not your incoming request' });
  if (r.status !== SwapStatus.PENDING) return res.status(400).json({ message: 'Already resolved' });

  const fromEvent = db.events.find(e => e.id === r.fromEventId);
  const toEvent   = db.events.find(e => e.id === r.toEventId);
  if (!fromEvent || !toEvent) return res.status(500).json({ message: 'Events missing' });

  if (!accept) {
    r.status = SwapStatus.REJECTED;
    fromEvent.status = EventStatus.SWAPPABLE;
    toEvent.status = EventStatus.SWAPPABLE;
    return res.json({ status: r.status });
  }

  // Accept: swap owners and set BUSY
  const tempOwner = fromEvent.ownerId;
  fromEvent.ownerId = toEvent.ownerId;
  toEvent.ownerId = tempOwner;
  fromEvent.status = EventStatus.BUSY;
  toEvent.status = EventStatus.BUSY;
  r.status = SwapStatus.ACCEPTED;
  res.json({ status: r.status, fromEventId: fromEvent.id, toEventId: toEvent.id });
}