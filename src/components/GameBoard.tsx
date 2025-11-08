import { useGameStore } from '../store/gameStore';
import { Timer } from './Timer';
import { CategoryDisplay } from './CategoryDisplay';
import { CategoryChoice } from './CategoryChoice';
import { PlayerHand } from './PlayerHand';
import { ActionModal } from './ActionModal';
import { RoundEnd } from './RoundEnd';
import { GameEnd } from './GameEnd';

export function GameBoard() {
  const {
    phase,
    players,
    currentPlayerIndex,
    direction,
    currentRound,
    lastPlayedCard,
    localPlayerId,
  } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];

  // Show category selection modal
  if (phase === 'category-selection') {
    return <CategoryChoice />;
  }

  // Show round end screen
  if (phase === 'round-end') {
    return <RoundEnd />;
  }

  // Show game end screen
  if (phase === 'game-end') {
    return <GameEnd />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">CRACKLIST</h1>
              <p className="text-gray-600">Manche {currentRound}</p>
            </div>

            <Timer />

            <div className="text-right">
              <p className="text-sm text-gray-600">Tour de</p>
              <p className="text-xl font-bold text-gray-800">
                {currentPlayer?.name || 'En attente...'}
              </p>
              <p className="text-xs text-gray-500">
                {direction === 1 ? '→ Sens horaire' : '← Sens anti-horaire'}
              </p>
            </div>
          </div>
        </div>

        {/* Main game area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Category and played card */}
          <div className="lg:col-span-1 space-y-6">
            <CategoryDisplay />

            {lastPlayedCard && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Dernière carte jouée
                </h3>
                <div className="flex justify-center">
                  {lastPlayedCard.type === 'letter' ? (
                    <div className="card-letter">
                      <span className="text-5xl font-bold text-blue-600">
                        {lastPlayedCard.letter}
                      </span>
                      {lastPlayedCard.penalty > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          +{lastPlayedCard.penalty}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="card-action bg-gradient-to-br from-purple-500 to-pink-500">
                      <span className="text-sm font-bold text-white">
                        {lastPlayedCard.type.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Players list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Joueurs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`p-4 rounded-lg border-2 ${
                      index === currentPlayerIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    } ${player.id === localPlayerId ? 'ring-2 ring-green-400' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{player.name}</span>
                          {player.id === localPlayerId && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                              Vous
                            </span>
                          )}
                          {player.isHost && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                              Hôte
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {player.hand.length} cartes
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {player.roundsWon}
                        </div>
                        <div className="text-xs text-gray-500">manches</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Player hand */}
            <PlayerHand />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ActionModal />
    </div>
  );
}
