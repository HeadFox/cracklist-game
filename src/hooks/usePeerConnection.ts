import { useEffect, useRef, useState } from 'react';
import Peer, { DataConnection } from 'peerjs';
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

  // Initialize peer
  useEffect(() => {
    const newPeer = new Peer();

    newPeer.on('open', (id) => {
      setPeerId(id);
      setLocalPlayerId(id);
      console.log('Peer ID:', id);
    });

    newPeer.on('error', (err) => {
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
  }, []);

  // Handle incoming connection
  const handleIncomingConnection = (conn: DataConnection) => {
    console.log('Incoming connection from:', conn.peer);

    conn.on('open', () => {
      console.log('Connection opened with:', conn.peer);
      setConnections((prev) => [...prev, conn]);
      connectionsRef.current = [...connectionsRef.current, conn];
    });

    conn.on('data', (data) => {
      handleMessage(data as P2PMessage, conn);
    });

    conn.on('close', () => {
      console.log('Connection closed with:', conn.peer);
      setConnections((prev) => prev.filter((c) => c.peer !== conn.peer));
      connectionsRef.current = connectionsRef.current.filter((c) => c.peer !== conn.peer);
      removePlayer(conn.peer);
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
    });
  };

  // Create a room (host)
  const createRoom = (playerName: string) => {
    if (!peer) return;

    const code = peer.id.substring(0, 6).toUpperCase();
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
  };

  // Join a room
  const joinRoom = (code: string, playerName: string) => {
    if (!peer) return;

    try {
      const hostId = code.toLowerCase();
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

      conn.on('data', (data) => {
        handleMessage(data as P2PMessage, conn);
      });

      conn.on('close', () => {
        console.log('Disconnected from host');
        setError('Disconnected from host');
      });

      conn.on('error', (err) => {
        console.error('Connection error:', err);
        setError('Failed to connect to room');
      });
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('Failed to join room');
    }
  };

  // Handle incoming messages
  const handleMessage = (message: P2PMessage, conn: DataConnection) => {
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
          broadcastToAll({ type: 'state-update', state: useGameStore.getState() });
        }
        break;

      case 'state-update':
        // Update local state with received state
        updateState(message.state);
        break;

      case 'play-card':
        // Handle card play
        // This would trigger game logic on the host
        break;

      case 'choose-category':
        // Handle category selection
        break;

      // Add other message handlers as needed
    }
  };

  // Send message to specific connection
  const sendMessage = (conn: DataConnection, message: P2PMessage) => {
    if (conn && conn.open) {
      conn.send(message);
    }
  };

  // Broadcast message to all connections
  const broadcastToAll = (message: P2PMessage) => {
    connectionsRef.current.forEach((conn) => {
      if (conn.open) {
        conn.send(message);
      }
    });
  };

  // Broadcast state update
  const broadcastState = () => {
    if (isHost) {
      const state = useGameStore.getState();
      broadcastToAll({ type: 'state-update', state });
    }
  };

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
