'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
import { SubEventType } from '@/types/webSocket';

interface WebSocketContextType {
  socket: Socket | null;
  subscribe: (eventType: SubEventType, id: number) => void;
  unsubscribe: (eventType: SubEventType, id: number) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('Connecting to WebSocket at:', process.env.NEXT_PUBLIC_API_BASE_URL);
    // Socket.IO 연결
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`, {
      transports: ['websocket'],
      withCredentials: true, // 쿠키 자동 전송
    });

    newSocket.on('connect', () => {
      console.log('웹소켓 연결됨');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('웹소켓 연결 해제됨');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const subscribe = useCallback(
    (eventType: SubEventType, id: number) => {
      if (socket && isConnected) {
        socket.emit('subscribe', { eventType, id });
        console.log(`구독: ${eventType}:${id}`);
      }
    },
    [socket, isConnected]
  );

  const unsubscribe = useCallback(
    (eventType: SubEventType, id: number) => {
      if (socket && isConnected) {
        socket.emit('unsubscribe', { eventType, id });
        console.log(`구독 해제: ${eventType}:${id}`);
      }
    },
    [socket, isConnected]
  );

  return (
    <WebSocketContext.Provider value={{ socket, subscribe, unsubscribe, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('웹소켓은 웹소켓 프로바이더 내부에서 사용해야 합니다.');
  }
  return context;
};
