import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.MODE === 'production' ? '/app/' : 'http://localhost:3005';

export const socket = io(URL, {});