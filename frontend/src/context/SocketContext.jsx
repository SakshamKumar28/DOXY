import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only connect if user is authenticated? 
    // Or connect always but identify?
    // Let's connect always for now, layout efficiency.
    // But for "onlineness", usually need auth.
    // Let's just create the socket instance.
    
    const newSocket = io({
        path: '/socket.io',
        // If we need to pass token:
        // auth: { token: ... }
        // But we use cookies. Socket.io client automatically sends cookies (credentials).
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []); // Run once on mount? Or dependent on user? using cookies so maybe once is fine.

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
