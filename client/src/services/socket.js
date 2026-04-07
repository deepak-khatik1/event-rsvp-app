import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io('/', { autoConnect: false });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const joinEvent = (eventId) => {
  const s = connectSocket();
  s.emit('join-event', eventId);
};

export const leaveEvent = (eventId) => {
  const s = getSocket();
  s.emit('leave-event', eventId);
};

export const joinAdmin = () => {
  const s = connectSocket();
  s.emit('join-admin');
};

export const leaveAdmin = () => {
  const s = getSocket();
  s.emit('leave-admin');
};
