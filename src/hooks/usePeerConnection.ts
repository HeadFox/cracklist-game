import { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import type { P2PMessage, Player } from '../types/game';
import { useGameStore } from '../store/gameStore';

export function usePeerConnection() {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [peerId, setPeerId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const connectionsRef = useRef<DataConnection[]>([]);

  const {
    setLocalPlayerId,
    roomCode,
    setRoomCode,
    addPlayer,
    removePlayer,
    updateState,
  } = useGameStore();

  // Handle incoming messages
  const handleMessage = useCallback((message: P2PMessage, conn: DataConnection) => {
    console.log('Received message:', message);

    switch (message.type) {
      case 'join':
        if (isHost) {
          // Add new player
          const newPlayer: Player = {
            id: conn.peer,
            name: message.playerName,
            hand: [],
            roundsWon: 0,
            isHost: false,
          };
          addPlayer(newPlayer);

          // Broadcast updated state to all players
          const currentState = useGameStore.getState();
          connectionsRef.current.forEach((c) => {
            if (c.open) {
              c.send({ type: 'state-update', state: currentState });
            }
          });
        }
        break;

      case 'state-update':
        // Update local state with received state
        updateState(message.state);
        break;

      case 'play-card':
      case 'choose-category':
        // These would be handled by the game logic
        break;
    }
  }, [isHost, addPlayer, updateState]);

  // Handle incoming connection
  const handleIncomingConnection = useCallback((conn: DataConnection) => {
    console.log('Incoming connection from:', conn.peer);

    conn.on('open', () => {
      console.log('Connection opened with:', conn.peer);
      setConnections((prev) => [...prev, conn]);
      connectionsRef.current = [...connectionsRef.current, conn];
    });

    conn.on('data', (data: unknown) => {
      handleMessage(data as P2PMessage, conn);
    });

    conn.on('close', () => {
      console.log('Connection closed with:', conn.peer);
      setConnections((prev) => prev.filter((c) => c.peer !== conn.peer));
      connectionsRef.current = connectionsRef.current.filter((c) => c.peer !== conn.peer);
      removePlayer(conn.peer);
    });

    conn.on('error', (err: Error) => {
      console.error('Connection error:', err);
    });
  }, [handleMessage, removePlayer]);

  // Initialize peer
  useEffect(() => {
    const newPeer = new Peer();

    newPeer.on('open', (id) => {
      setPeerId(id);
      setLocalPlayerId(id);
      console.log('Peer ID:', id);
    });

    newPeer.on('error', (err: Error) => {
      console.error('Peer error:', err);
      setError(err.message);
    });

    newPeer.on('connection', (conn) => {
      handleIncomingConnection(conn);
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, [setLocalPlayerId, handleIncomingConnection]);

  // Create a room (host)
  const createRoom = useCallback((playerName: string) => {
    if (!peer) return;

    // Use the full peer ID as room code for P2P connection
    const code = peer.id;
    setRoomCode(code);
    setIsHost(true);

    // Add host as player
    const hostPlayer: Player = {
      id: peer.id,
      name: playerName,
      hand: [],
      roundsWon: 0,
      isHost: true,
    };
    addPlayer(hostPlayer);
  }, [peer, setRoomCode, addPlayer]);

  // Join a room
  const joinRoom = useCallback((code: string, playerName: string) => {
    if (!peer) return;

    try {
      // Use the room code directly as the peer ID (case-sensitive)
      const hostId = code.trim();
      const conn = peer.connect(hostId);

      conn.on('open', () => {
        console.log('Connected to host:', hostId);
        setRoomCode(code);
        setIsHost(false);

        // Send join message
        const joinMessage: P2PMessage = {
          type: 'join',
          playerName,
        };
        conn.send(joinMessage);

        setConnections([conn]);
        connectionsRef.current = [conn];
      });

      conn.on('data', (data: unknown) => {
        handleMessage(data as P2PMessage, conn);
      });

      conn.on('close', () => {
        console.log('Disconnected from host');
        setError('Disconnected from host');
      });

      conn.on('error', (err: Error) => {
        console.error('Connection error:', err);
        setError('Failed to connect to room');
      });
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('Failed to join room');
    }
  }, [peer, setRoomCode, handleMessage]);

  // Send message to specific connection
  const sendMessage = useCallback((conn: DataConnection, message: P2PMessage) => {
    if (conn && conn.open) {
      conn.send(message);
    }
  }, []);

  // Broadcast message to all connections
  const broadcastToAll = useCallback((message: P2PMessage) => {
    connectionsRef.current.forEach((conn) => {
      if (conn.open) {
        conn.send(message);
      }
    });
  }, []);

  // Broadcast state update
  const broadcastState = useCallback(() => {
    if (isHost) {
      const state = useGameStore.getState();
      broadcastToAll({ type: 'state-update', state });
    }
  }, [isHost, broadcastToAll]);

  return {
    peer,
    peerId,
    connections,
    isHost,
    roomCode,
    error,
    createRoom,
    joinRoom,
    sendMessage,
    broadcastToAll,
    broadcastState,
  };
}
