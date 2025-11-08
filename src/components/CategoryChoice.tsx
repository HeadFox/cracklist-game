import { useGameStore } from '../store/gameStore';

export function CategoryChoice() {
  const { currentCategoryCard, selectCategory, currentPlayerIndex, localPlayerId, players } =
    useGameStore();

  if (!currentCategoryCard) return null;

  const isCurrentPlayer = players[currentPlayerIndex]?.id === localPlayerId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-600">
          {isCurrentPlayer ? 'Choisissez une catégorie' : 'En attente du choix...'}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {isCurrentPlayer
            ? 'Sélectionnez la catégorie pour cette manche'
            : `${players[currentPlayerIndex]?.name} choisit la catégorie`}
        </p>

        <div className="grid grid-cols-1 gap-4">
          {currentCategoryCard.categories.map((category, index) => (
            <button
              key={index}
              onClick={() => isCurrentPlayer && selectCategory(index as 0 | 1 | 2)}
              disabled={!isCurrentPlayer}
              className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="text-2xl font-bold">{category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
