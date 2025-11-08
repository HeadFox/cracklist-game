import { useGameStore } from '../store/gameStore';

export function ActionModal() {
  const {
    pendingAction,
    players,
    localPlayerId,
    currentPlayerIndex,
    selectSwapTarget,
    selectPenaltyTarget,
  } = useGameStore();

  if (!pendingAction) return null;

  const currentPlayer = players[currentPlayerIndex];
  const isMyAction = currentPlayer?.id === localPlayerId;

  // SWAP target selection
  if (pendingAction.type === 'select-swap-target') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
            Carte SWAP
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {isMyAction
              ? 'Choisissez un joueur pour échanger toute votre main'
              : `${currentPlayer?.name} choisit un joueur...`}
          </p>

          <div className="space-y-3">
            {players
              .filter((p) => p.id !== currentPlayer?.id)
              .map((player) => (
                <button
                  key={player.id}
                  onClick={() => isMyAction && selectSwapTarget(player.id, true)}
                  disabled={!isMyAction}
                  className="w-full p-4 bg-blue-100 hover:bg-blue-200 rounded-lg font-semibold text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {player.name} ({player.hand.length} cartes)
                </button>
              ))}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg">
            ⚠️ Si c'est votre dernière carte, l'autre joueur gagnera la manche !
          </div>
        </div>
      </div>
    );
  }

  // Penalty target selection
  if (pendingAction.type === 'select-penalty-target') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4 text-red-600">
            Carte Bonus +{pendingAction.penalty}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {isMyAction
              ? `Choisissez un joueur qui piochera ${pendingAction.penalty} carte(s)`
              : `${currentPlayer?.name} choisit un joueur...`}
          </p>

          <div className="space-y-3">
            {players
              .filter((p) => p.id !== currentPlayer?.id)
              .map((player) => (
                <button
                  key={player.id}
                  onClick={() => isMyAction && selectPenaltyTarget(player.id, pendingAction.penalty)}
                  disabled={!isMyAction}
                  className="w-full p-4 bg-red-100 hover:bg-red-200 rounded-lg font-semibold text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {player.name} ({player.hand.length} cartes)
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
