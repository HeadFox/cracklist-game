import { useGameStore } from '../store/gameStore';

export function CategoryDisplay() {
  const { currentCategory, usedAnswers } = useGameStore();

  if (!currentCategory) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
        Catégorie actuelle
      </h2>
      <p className="text-3xl font-bold text-blue-600 mb-4">{currentCategory}</p>

      {usedAnswers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            Réponses déjà jouées ({usedAnswers.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {usedAnswers.map((answer, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {answer}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
