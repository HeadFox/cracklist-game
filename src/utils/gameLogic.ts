import type { Card, GameState, Player, LetterCard } from '../types/game';

/**
 * Normalize a string for comparison (lowercase, remove accents, trim)
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
}

/**
 * Validate if an answer is valid for a given letter and category
 */
export function validateAnswer(
  answer: string,
  letter: string,
  _category: string,
  usedAnswers: string[]
): { valid: boolean; reason?: string } {
  const normalizedAnswer = normalizeString(answer);
  const normalizedLetter = normalizeString(letter);

  // Check if answer is empty
  if (normalizedAnswer.length === 0) {
    return { valid: false, reason: 'Réponse vide' };
  }

  // Check if answer starts with the letter (ignore articles like "the", "le", "la", etc.)
  const wordsInAnswer = normalizedAnswer.split(/\s+/);
  const articles = ['le', 'la', 'les', 'un', 'une', 'des', 'the', 'a', 'an'];

  let firstSignificantWord = wordsInAnswer[0];
  if (articles.includes(wordsInAnswer[0]) && wordsInAnswer.length > 1) {
    firstSignificantWord = wordsInAnswer[1];
  }

  if (!firstSignificantWord.startsWith(normalizedLetter)) {
    return { valid: false, reason: `Ne commence pas par "${letter}"` };
  }

  // Check if answer was already used
  const normalizedUsedAnswers = usedAnswers.map(normalizeString);
  if (normalizedUsedAnswers.includes(normalizedAnswer)) {
    return { valid: false, reason: 'Réponse déjà utilisée' };
  }

  return { valid: true };
}

/**
 * Get the next player index based on direction
 */
export function getNextPlayerIndex(
  currentIndex: number,
  playerCount: number,
  direction: 1 | -1,
  skipNext: boolean = false
): number {
  const step = skipNext ? direction * 2 : direction;
  return (currentIndex + step + playerCount) % playerCount;
}

/**
 * Check if a player can finish with a specific card
 */
export function canFinishWithCard(card: Card, handSize: number): { canFinish: boolean; reason?: string } {
  // Must be the last card
  if (handSize !== 1) {
    return { canFinish: true };
  }

  // Cannot finish with CRACK_LIST
  if (card.type === 'crack_list') {
    return { canFinish: false, reason: 'Impossible de finir avec CRACK LIST' };
  }

  // SWAP makes the other player win
  if (card.type === 'swap') {
    return { canFinish: true, reason: 'ATTENTION: L\'autre joueur gagnera!' };
  }

  return { canFinish: true };
}

/**
 * Apply a card's effect to the game state
 */
export function applyCardEffect(
  card: Card,
  state: GameState,
  _playerId: string,
  answer?: string
): Partial<GameState> {
  const updates: Partial<GameState> = {};

  switch (card.type) {
    case 'letter':
      // Letter card: add answer to used answers
      if (answer) {
        updates.usedAnswers = [...state.usedAnswers, answer];
        updates.lastPlayedCard = card;
      }
      break;

    case 'stop':
      // Stop card: skip next player
      updates.skipNext = true;
      updates.lastPlayedCard = card;
      break;

    case 'reverse':
      // Reverse card: change direction
      updates.direction = state.direction === 1 ? -1 : 1;
      updates.lastPlayedCard = card;
      break;

    case 'crack_list':
      // Crack list: need to select a new category
      updates.pendingAction = { type: 'select-category', categoryCard: state.currentCategoryCard! };
      updates.lastPlayedCard = card;
      break;

    case 'swap':
      // Swap: need to select a target player
      updates.pendingAction = { type: 'select-swap-target', swapCard: card };
      updates.lastPlayedCard = card;
      break;
  }

  return updates;
}

/**
 * Check if the round is over (a player has no cards left)
 */
export function checkRoundEnd(players: Player[]): { isOver: boolean; winnerId?: string } {
  const winner = players.find(p => p.hand.length === 0);
  return {
    isOver: !!winner,
    winnerId: winner?.id,
  };
}

/**
 * Check if the game is over (a player has won 3 rounds)
 */
export function checkGameEnd(players: Player[], roundsToWin: number = 3): { isOver: boolean; winnerId?: string } {
  const winner = players.find(p => p.roundsWon >= roundsToWin);
  return {
    isOver: !!winner,
    winnerId: winner?.id,
  };
}

/**
 * Handle penalty cards (+1, +2, +3)
 */
export function getPenaltyAmount(card: Card): number {
  if (card.type === 'letter') {
    return (card as LetterCard).penalty;
  }
  return 0;
}

/**
 * Check if all players are stuck (everyone drew a card without playing)
 */
export function shouldAbandonCategory(consecutiveDraws: number, playerCount: number): boolean {
  return consecutiveDraws >= playerCount;
}

/**
 * Calculate score for a player (for leaderboard)
 */
export function calculatePlayerScore(player: Player): number {
  return player.roundsWon * 100 - player.hand.length * 10;
}

/**
 * Generate a random room code
 */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
