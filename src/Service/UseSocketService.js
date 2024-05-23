// useSocketService.js
import { useState, useEffect } from 'react';
import * as io from 'socket.io-client';
import { useParams } from 'react-router-dom';

function useSocketService() {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  // const [receivedMessage, setReceivedMessage] = useState(null);
  const [messageData, setMessageData] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    const username = localStorage.getItem('userName');
    const socketUrl = `http://192.168.0.231:8085?room=${roomId}&username=${username}"`;
    
    // Create a Netty Socket.IO client instance
    const newSocket = io(socketUrl, {
      transports: ['websocket'], // Ensure to use WebSocket transport
      upgrade: false // Disable upgrade option for WebSocket
    });
    console.log("created socket")

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnectionStatus(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnectionStatus(false);
    });

    newSocket.on('receive_message', (data) => {
      console.log('Received message from server:', data);
      setMessageData(prevMessages => [...prevMessages, data])
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (data) => {
    console.log('Sending message to server:', data);
    socket.emit('send_message', data);
  };

  return {
    connectionStatus,
    messageData,
    sendMessage,
  };
}

export default useSocketService;