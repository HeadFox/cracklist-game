import { useGameStore } from '../store/gameStore';

export function GameEnd() {
  const { players, resetGame, localPlayerId } = useGameStore();

  // Find game winner
  const sortedPlayers = [...players].sort((a, b) => b.roundsWon - a.roundsWon);
  const winner = sortedPlayers[0];

  const isHost = players.find((p) => p.id === localPlayerId)?.isHost;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            VICTOIRE !
          </h1>
          <p className="text-3xl font-bold text-gray-800 mb-2">
            {winner.name} gagne la partie ! 🏆
          </p>
          <p className="text-xl text-gray-600">
            {winner.roundsWon} manches remportées
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Classement final
          </h2>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                    : index === 2
                    ? 'bg-gradient-to-r from-orange-300 to-orange-400'
                    : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                  </span>
                  <div>
                    <div className="text-lg font-bold">{player.name}</div>
                    <div className="text-sm">
                      {player.roundsWon} manches gagnées
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {isHost && (
            <button onClick={resetGame} className="w-full btn-primary text-lg py-4">
              Nouvelle partie
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-full btn-secondary text-lg py-4"
          >
            Retour au menu
          </button>
        </div>
      </div>
    </div>
  );
}
