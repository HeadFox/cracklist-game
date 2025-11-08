import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePeerConnection } from '../hooks/usePeerConnection';
import { GAME_CONFIG } from '../types/game';

export function Lobby() {
  const [playerName, setPlayerName] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');

  const { players, startGame } = useGameStore();
  const { roomCode, isHost, error, createRoom, joinRoom } = usePeerConnection();

  const handleCreateRoom = () => {
    if (playerName.trim()) {
      createRoom(playerName);
      setMode('create');
    }
  };

  const handleJoinRoom = () => {
    if (playerName.trim() && roomCodeInput.trim()) {
      joinRoom(roomCodeInput.toUpperCase(), playerName);
      setMode('join');
    }
  };

  const handleStartGame = () => {
    if (players.length >= GAME_CONFIG.MIN_PLAYERS) {
      startGame();
    }
  };

  // Main menu
  if (mode === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-5xl font-bold text-center mb-2 text-blue-600">
            CRACKLIST
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Petit Bac meets UNO
          </p>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Votre nom"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              maxLength={20}
            />

            <button
              onClick={handleCreateRoom}
              disabled={!playerName.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer une partie
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">ou</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <input
              type="text"
              placeholder="Code de la partie"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              maxLength={6}
            />

            <button
              onClick={handleJoinRoom}
              disabled={!playerName.trim() || !roomCodeInput.trim()}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Rejoindre une partie
            </button>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>2-{GAME_CONFIG.MAX_PLAYERS} joueurs • {GAME_CONFIG.ROUNDS_TO_WIN} manches gagnantes</p>
          </div>
        </div>
      </div>
    );
  }

  // Waiting room
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-600">
          Salle d'attente
        </h2>

        {roomCode && (
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Code de la partie:</p>
            <div className="inline-block bg-blue-100 px-6 py-3 rounded-lg">
              <span className="text-3xl font-bold text-blue-600 tracking-wider">
                {roomCode}
              </span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Joueurs ({players.length}/{GAME_CONFIG.MAX_PLAYERS})
          </h3>
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{player.name}</span>
                {player.isHost && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    Hôte
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <button
            onClick={handleStartGame}
            disabled={players.length < GAME_CONFIG.MIN_PLAYERS}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {players.length < GAME_CONFIG.MIN_PLAYERS
              ? `En attente de joueurs (min. ${GAME_CONFIG.MIN_PLAYERS})`
              : 'Démarrer la partie'}
          </button>
        )}

        {!isHost && (
          <div className="text-center text-gray-600">
            En attente que l'hôte démarre la partie...
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
