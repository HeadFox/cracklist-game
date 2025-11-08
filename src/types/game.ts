// Card types
export type CardType = 'letter' | 'crack_list' | 'stop' | 'reverse' | 'swap';

export type LetterCard = {
  type: 'letter';
  letter: string;
  penalty: 0 | 1 | 2 | 3; // 0 = normal, 1/2/3 = bonus cards (+1, +2, +3)
};

export type ActionCard = {
  type: 'crack_list' | 'stop' | 'reverse' | 'swap';
};

export type Card = LetterCard | ActionCard;

// Category types
export type CategoryCard = {
  id: string;
  categories: [string, string, string]; // 3 categories per card
};

// Player types
export type Player = {
  id: string;
  name: string;
  hand: Card[];
  roundsWon: number;
  isHost: boolean;
};

// Game state types
export type GamePhase = 'lobby' | 'category-selection' | 'playing' | 'round-end' | 'game-end';

export type GameState = {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  direction: 1 | -1; // 1 = clockwise, -1 = counter-clockwise
  currentCategory: string;
  currentCategoryCard: CategoryCard | null;
  usedAnswers: string[]; // words already played for this category
  drawPile: Card[];
  categoryPile: CategoryCard[];
  currentRound: number;
  skipNext: boolean; // for STOP card
  timeLeft: number; // 20 seconds timer
  timerActive: boolean;
  lastPlayedCard: Card | null;
  pendingAction: PendingAction | null;
};

// Pending actions (for SWAP, penalty target selection, etc.)
export type PendingAction =
  | { type: 'select-category'; categoryCard: CategoryCard }
  | { type: 'select-swap-target'; swapCard: ActionCard }
  | { type: 'select-penalty-target'; penalty: number }
  | { type: 'select-swap-mode'; targetPlayerId: string };

// P2P Message types
export type P2PMessage =
  | { type: 'join'; playerName: string }
  | { type: 'state-update'; state: GameState }
  | { type: 'play-card'; cardIndex: number; answer?: string }
  | { type: 'choose-category'; categoryIndex: 0 | 1 | 2 }
  | { type: 'countdown-start' }
  | { type: 'swap-target'; targetPlayerId: string; swapAll: boolean; cardIndex?: number }
  | { type: 'penalty-target'; targetPlayerId: string }
  | { type: 'next-round' }
  | { type: 'end-game' }
  | { type: 'player-ready' };

// Game configuration
export const GAME_CONFIG = {
  INITIAL_HAND_SIZE: 8,
  TURN_DURATION: 20, // seconds
  ROUNDS_TO_WIN: 3,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 8,
} as const;
