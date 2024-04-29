import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.MODE === 'production' ? '/socket/' : 'http://localhost:3005';

export const socket = io(URL, {});
console.log(URL)
