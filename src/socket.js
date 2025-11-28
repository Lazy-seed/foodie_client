import io from 'socket.io-client';

// Replace with your actual backend URL
const SOCKET_URL = process.env.REACT_APP_API_URL;

export const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true
});

socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
});
