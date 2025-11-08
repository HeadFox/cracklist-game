import { useGameStore } from '../store/gameStore';
import { GAME_CONFIG } from '../types/game';

export function RoundEnd() {
  const { players, currentRound, nextRound, localPlayerId } = useGameStore();

  // Find round winner
  const sortedPlayers = [...players].sort((a, b) => b.roundsWon - a.roundsWon);
  const roundWinner = sortedPlayers[0];

  const isHost = players.find((p) => p.id === localPlayerId)?.isHost;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Manche {currentRound} terminée !
          </h1>
          <p className="text-2xl text-gray-700">
            {roundWinner.name} remporte cette manche ! 🎉
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Classement</h2>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                    : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">#{index + 1}</span>
                  <span className="text-lg font-semibold">{player.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    {player.roundsWon} / {GAME_CONFIG.ROUNDS_TO_WIN}
                  </div>
                  <div className="text-sm text-gray-600">manches gagnées</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <button onClick={nextRound} className="w-full btn-primary text-lg py-4">
            Manche suivante
          </button>
        ) : (
          <div className="text-center text-gray-600">
            En attente de l'hôte...
          </div>
        )}
      </div>
    </div>
  );
}
