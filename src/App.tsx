import { useGameStore } from './store/gameStore';
import { Lobby } from './components/Lobby';
import { GameBoard } from './components/GameBoard';

function App() {
  const { phase } = useGameStore();

  // Show lobby if in lobby phase
  if (phase === 'lobby') {
    return <Lobby />;
  }

  // Show game board for all other phases
  return <GameBoard />;
}

export default App;
