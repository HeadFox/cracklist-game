import { create } from 'zustand';
import type { GameState, Player } from '../types/game';
import { GAME_CONFIG } from '../types/game';
import { generateDeck, dealCards, drawCards } from '../utils/deck';
import { generateCategoryDeck, drawCategoryCard } from '../utils/categories';
import {
  validateAnswer,
  getNextPlayerIndex,
  canFinishWithCard,
  checkGameEnd,
  getPenaltyAmount,
} from '../utils/gameLogic';

interface GameStore extends GameState {
  // Player management
  localPlayerId: string;
  roomCode: string;
  setLocalPlayerId: (id: string) => void;
  setRoomCode: (code: string) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;

  // Game initialization
  startGame: () => void;
  resetGame: () => void;

  // Turn actions
  playCard: (cardIndex: number, answer?: string) => { success: boolean; reason?: string };
  drawCard: () => void;
  selectCategory: (categoryIndex: 0 | 1 | 2) => void;
  selectSwapTarget: (targetPlayerId: string, swapAll: boolean, cardIndex?: number) => void;
  selectPenaltyTarget: (targetPlayerId: string, penalty: number) => void;

  // Timer management
  startTimer: () => void;
  stopTimer: () => void;
  decrementTimer: () => void;

  // Round/Game management
  endRound: () => void;
  nextRound: () => void;
  endGame: () => void;

  // State update (for P2P sync)
  updateState: (state: Partial<GameState>) => void;
}

const initialState: GameState = {
  phase: 'lobby',
  players: [],
  currentPlayerIndex: 0,
  direction: 1,
  currentCategory: '',
  currentCategoryCard: null,
  usedAnswers: [],
  drawPile: [],
  categoryPile: [],
  currentRound: 1,
  skipNext: false,
  timeLeft: GAME_CONFIG.TURN_DURATION,
  timerActive: false,
  lastPlayedCard: null,
  pendingAction: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  localPlayerId: '',
  roomCode: '',

  setLocalPlayerId: (id) => set({ localPlayerId: id }),
  setRoomCode: (code) => set({ roomCode: code }),

  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),

  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),

  startGame: () => {
    const state = get();
    if (state.players.length < GAME_CONFIG.MIN_PLAYERS) {
      return;
    }

    // Generate and shuffle decks
    const gameDeck = generateDeck();
    const categoryDeck = generateCategoryDeck();

    // Deal cards to players
    const { hands, remaining } = dealCards(gameDeck, state.players.length, GAME_CONFIG.INITIAL_HAND_SIZE);

    // Update players with their hands
    const updatedPlayers = state.players.map((player, index) => ({
      ...player,
      hand: hands[index],
    }));

    // Draw first category card
    const { card: categoryCard, remaining: remainingCategories } = drawCategoryCard(categoryDeck);

    set({
      phase: 'category-selection',
      players: updatedPlayers,
      drawPile: remaining,
      categoryPile: remainingCategories,
      currentCategoryCard: categoryCard,
      currentPlayerIndex: 0,
    });
  },

  resetGame: () => {
    set({
      ...initialState,
      players: get().players.map((p) => ({ ...p, hand: [], roundsWon: 0 })),
      localPlayerId: get().localPlayerId,
      roomCode: get().roomCode,
    });
  },

  playCard: (cardIndex, answer) => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];

    if (!currentPlayer || currentPlayer.id !== state.localPlayerId) {
      return { success: false, reason: 'Ce n\'est pas votre tour' };
    }

    const card = currentPlayer.hand[cardIndex];
    if (!card) {
      return { success: false, reason: 'Carte invalide' };
    }

    // Check if can finish with this card
    const { canFinish, reason: finishReason } = canFinishWithCard(card, currentPlayer.hand.length);
    if (!canFinish) {
      return { success: false, reason: finishReason };
    }

    // Validate answer for letter cards
    if (card.type === 'letter') {
      if (!answer) {
        return { success: false, reason: 'Réponse requise' };
      }

      const validation = validateAnswer(answer, card.letter, state.currentCategory, state.usedAnswers);
      if (!validation.valid) {
        return { success: false, reason: validation.reason };
      }
    }

    // Remove card from hand
    const newHand = currentPlayer.hand.filter((_, i) => i !== cardIndex);
    const updatedPlayers = state.players.map((p) =>
      p.id === currentPlayer.id ? { ...p, hand: newHand } : p
    );

    // Check for penalty cards
    const penalty = getPenaltyAmount(card);
    let updates: Partial<GameState> = {
      players: updatedPlayers,
      lastPlayedCard: card,
    };

    if (answer) {
      updates.usedAnswers = [...state.usedAnswers, answer];
    }

    // Handle card effects
    switch (card.type) {
      case 'stop':
        updates.skipNext = true;
        break;
      case 'reverse':
        updates.direction = state.direction === 1 ? -1 : 1;
        break;
      case 'crack_list':
        updates.phase = 'category-selection';
        updates.pendingAction = { type: 'select-category', categoryCard: state.currentCategoryCard! };
        break;
      case 'swap':
        updates.pendingAction = { type: 'select-swap-target', swapCard: card };
        break;
    }

    if (penalty > 0) {
      updates.pendingAction = { type: 'select-penalty-target', penalty };
    }

    // Check if round is over
    if (newHand.length === 0) {
      const roundWinner = currentPlayer.id;
      updates.phase = 'round-end';
      updates.players = updatedPlayers.map((p) =>
        p.id === roundWinner ? { ...p, roundsWon: p.roundsWon + 1 } : p
      );
    } else if (!updates.pendingAction) {
      // Move to next player
      const nextIndex = getNextPlayerIndex(
        state.currentPlayerIndex,
        state.players.length,
        updates.direction ?? state.direction,
        updates.skipNext ?? false
      );
      updates.currentPlayerIndex = nextIndex;
      updates.skipNext = false;
      updates.timeLeft = GAME_CONFIG.TURN_DURATION;
    }

    set(updates);
    return { success: true };
  },

  drawCard: () => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];

    if (!currentPlayer || state.drawPile.length === 0) return;

    const { drawn, remaining } = drawCards(state.drawPile, 1);
    const updatedPlayers = state.players.map((p) =>
      p.id === currentPlayer.id ? { ...p, hand: [...p.hand, ...drawn] } : p
    );

    const nextIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length, state.direction, state.skipNext);

    set({
      players: updatedPlayers,
      drawPile: remaining,
      currentPlayerIndex: nextIndex,
      skipNext: false,
      timeLeft: GAME_CONFIG.TURN_DURATION,
    });
  },

  selectCategory: (categoryIndex) => {
    const state = get();
    if (!state.currentCategoryCard) return;

    const selectedCategory = state.currentCategoryCard.categories[categoryIndex];

    set({
      currentCategory: selectedCategory,
      usedAnswers: [],
      phase: 'playing',
      pendingAction: null,
      timeLeft: GAME_CONFIG.TURN_DURATION,
      timerActive: true,
    });
  },

  selectSwapTarget: (targetPlayerId, swapAll, cardIndex) => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];
    const targetPlayer = state.players.find((p) => p.id === targetPlayerId);

    if (!currentPlayer || !targetPlayer) return;

    let updatedPlayers = [...state.players];

    if (swapAll) {
      // Swap entire hands
      updatedPlayers = updatedPlayers.map((p) => {
        if (p.id === currentPlayer.id) return { ...p, hand: targetPlayer.hand };
        if (p.id === targetPlayerId) return { ...p, hand: currentPlayer.hand };
        return p;
      });
    } else if (cardIndex !== undefined) {
      // Swap single card (not implemented in brief, but useful)
      // TODO: implement single card swap
    }

    const nextIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length, state.direction, false);

    set({
      players: updatedPlayers,
      pendingAction: null,
      currentPlayerIndex: nextIndex,
      timeLeft: GAME_CONFIG.TURN_DURATION,
    });
  },

  selectPenaltyTarget: (targetPlayerId, penalty) => {
    const state = get();
    const { drawn, remaining } = drawCards(state.drawPile, penalty);

    const updatedPlayers = state.players.map((p) =>
      p.id === targetPlayerId ? { ...p, hand: [...p.hand, ...drawn] } : p
    );

    const nextIndex = getNextPlayerIndex(state.currentPlayerIndex, state.players.length, state.direction, state.skipNext);

    set({
      players: updatedPlayers,
      drawPile: remaining,
      pendingAction: null,
      currentPlayerIndex: nextIndex,
      skipNext: false,
      timeLeft: GAME_CONFIG.TURN_DURATION,
    });
  },

  startTimer: () => set({ timerActive: true }),
  stopTimer: () => set({ timerActive: false }),

  decrementTimer: () => {
    const state = get();
    if (!state.timerActive) return;

    if (state.timeLeft <= 1) {
      // Time's up! Force draw
      get().drawCard();
      set({ timerActive: false, timeLeft: GAME_CONFIG.TURN_DURATION });
    } else {
      set({ timeLeft: state.timeLeft - 1 });
    }
  },

  endRound: () => {
    const state = get();
    const { isOver } = checkGameEnd(state.players, GAME_CONFIG.ROUNDS_TO_WIN);

    if (isOver) {
      set({ phase: 'game-end' });
    } else {
      set({ phase: 'round-end' });
    }
  },

  nextRound: () => {
    const state = get();

    // Generate new decks
    const gameDeck = generateDeck();
    const { hands, remaining } = dealCards(gameDeck, state.players.length, GAME_CONFIG.INITIAL_HAND_SIZE);

    // Update players with new hands
    const updatedPlayers = state.players.map((player, index) => ({
      ...player,
      hand: hands[index],
    }));

    // Draw new category card
    const { card: categoryCard, remaining: remainingCategories } = drawCategoryCard(state.categoryPile);

    set({
      phase: 'category-selection',
      players: updatedPlayers,
      drawPile: remaining,
      categoryPile: remainingCategories,
      currentCategoryCard: categoryCard,
      currentRound: state.currentRound + 1,
      usedAnswers: [],
      currentCategory: '',
      lastPlayedCard: null,
      pendingAction: null,
      timeLeft: GAME_CONFIG.TURN_DURATION,
    });
  },

  endGame: () => {
    set({ phase: 'game-end' });
  },

  updateState: (updates) => set(updates),
}));
