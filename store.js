// Simple in-memory store. Replace later with a real DB.
export const db = {
users: [], // { id, name, email, passwordHash }
events: [], // { id, title, startTime, endTime, status, ownerId }
swaps: [] // { id, status, fromUserId, fromEventId, toUserId, toEventId }
};


let _id = 1;
export const uid = () => String(_id++);


export const EventStatus = {
BUSY: 'BUSY',
SWAPPABLE: 'SWAPPABLE',
SWAP_PENDING: 'SWAP_PENDING'
};


export const SwapStatus = {
PENDING: 'PENDING',
ACCEPTED: 'ACCEPTED',
REJECTED: 'REJECTED'
};