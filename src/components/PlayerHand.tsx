import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Card } from '../types/game';

interface CardProps {
  card: Card;
  onClick: () => void;
  disabled: boolean;
}

function GameCard({ card, onClick, disabled }: CardProps) {
  if (card.type === 'letter') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="card-letter relative disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-5xl font-bold text-blue-600">{card.letter}</span>
        {card.penalty > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            +{card.penalty}
          </span>
        )}
      </button>
    );
  }

  const actionColors: Record<string, string> = {
    crack_list: 'from-purple-500 to-pink-500',
    stop: 'from-red-500 to-orange-500',
    reverse: 'from-green-500 to-teal-500',
    swap: 'from-blue-500 to-indigo-500',
  };

  const actionLabels: Record<string, string> = {
    crack_list: 'CRACK LIST',
    stop: 'STOP',
    reverse: 'REVERSE',
    swap: 'SWAP',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`card-action bg-gradient-to-br ${actionColors[card.type]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className="text-sm font-bold text-white text-center">
        {actionLabels[card.type]}
      </span>
    </button>
  );
}

export function PlayerHand() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const { players, localPlayerId, currentPlayerIndex, playCard, drawCard } = useGameStore();

  const localPlayer = players.find((p) => p.id === localPlayerId);
  const isMyTurn = players[currentPlayerIndex]?.id === localPlayerId;

  if (!localPlayer) return null;

  const handleCardClick = (index: number) => {
    if (!isMyTurn) return;
    setSelectedCard(index);
    setAnswer('');
    setError('');
  };

  const handlePlayCard = () => {
    if (selectedCard === null) return;

    const card = localPlayer.hand[selectedCard];

    // For letter cards, require an answer
    if (card.type === 'letter' && !answer.trim()) {
      setError('Veuillez entrer une réponse');
      return;
    }

    const result = playCard(selectedCard, answer.trim() || undefined);

    if (result.success) {
      setSelectedCard(null);
      setAnswer('');
      setError('');
    } else {
      setError(result.reason || 'Erreur');
    }
  };

  const handleDraw = () => {
    drawCard();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Votre main ({localPlayer.hand.length} cartes)
        </h2>
        <div className="text-sm text-gray-600">
          Manches gagnées: {localPlayer.roundsWon}
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-4 mb-4">
        {localPlayer.hand.map((card, index) => (
          <div
            key={index}
            className={`${
              selectedCard === index ? 'ring-4 ring-blue-500 rounded-xl' : ''
            }`}
          >
            <GameCard
              card={card}
              onClick={() => handleCardClick(index)}
              disabled={!isMyTurn}
            />
          </div>
        ))}
      </div>

      {/* Play controls */}
      {isMyTurn && selectedCard !== null && (
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
          {localPlayer.hand[selectedCard].type === 'letter' && (
            <input
              type="text"
              placeholder="Entrez votre réponse..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePlayCard()}
              className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
              autoFocus
            />
          )}

          <div className="flex gap-2">
            <button onClick={handlePlayCard} className="flex-1 btn-primary">
              Jouer la carte
            </button>
            <button onClick={() => setSelectedCard(null)} className="btn-secondary">
              Annuler
            </button>
          </div>

          {error && (
            <div className="p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>
          )}
        </div>
      )}

      {/* Draw button */}
      {isMyTurn && selectedCard === null && (
        <button onClick={handleDraw} className="w-full btn-secondary">
          Piocher une carte
        </button>
      )}

      {!isMyTurn && (
        <div className="text-center text-gray-500">
          En attente de {players[currentPlayerIndex]?.name}...
        </div>
      )}
    </div>
  );
}
