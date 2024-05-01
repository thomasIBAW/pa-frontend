import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.MODE === 'production' ? '/socket/' : 'http://localhost:3005';

export const socket = io(URL, {
        cors: {
            methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
            credentials: true
}
});

