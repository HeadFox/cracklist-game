import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function Timer() {
  const { timeLeft, timerActive, decrementTimer } = useGameStore();

  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, decrementTimer]);

  const percentage = (timeLeft / 20) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-4xl font-bold">
        <span className={isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-800'}>
          {timeLeft}s
        </span>
      </div>
      <div className="w-full max-w-xs h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isUrgent ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
