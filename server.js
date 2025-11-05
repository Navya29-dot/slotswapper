import express from 'express';
import cors from 'cors';
import { signup, login, requireAuth } from './auth.js';
import { listMine, create, update, remove, makeSwappable } from './events.js';
import { listOthersSwappable, createSwapRequest, listRequests, respondToSwap } from './swaps.js';


const app = express();
app.use(cors());
app.use(express.json());


// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));


// Auth
app.post('/api/auth/signup', signup);
app.post('/api/auth/login', login);


// Protected routes
app.use('/api', requireAuth);


// Events
app.get('/api/events', listMine);
app.post('/api/events', create);
app.put('/api/events/:id', update);
app.delete('/api/events/:id', remove);
app.post('/api/events/:id/make-swappable', makeSwappable);


// Swaps
app.get('/api/swappable-slots', listOthersSwappable);
app.get('/api/requests', listRequests);
app.post('/api/swap-request', createSwapRequest);
app.post('/api/swap-response/:requestId', respondToSwap);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
