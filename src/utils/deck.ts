import type { Card, LetterCard, ActionCard } from '../types/game';

// Letter distribution based on the brief
const LETTER_DISTRIBUTION: Array<{ letter: string; count: number; penalty: 0 | 1 | 2 | 3 }> = [
  // Normal letters (penalty 0) - 2-3 copies each
  { letter: 'A', count: 3, penalty: 0 },
  { letter: 'B', count: 2, penalty: 0 },
  { letter: 'C', count: 3, penalty: 0 },
  { letter: 'D', count: 2, penalty: 0 },
  { letter: 'E', count: 3, penalty: 0 },
  { letter: 'H', count: 2, penalty: 0 },
  { letter: 'I', count: 2, penalty: 0 },
  { letter: 'J', count: 2, penalty: 0 },
  { letter: 'M', count: 2, penalty: 0 },
  { letter: 'O', count: 2, penalty: 0 },
  { letter: 'P', count: 2, penalty: 0 },
  { letter: 'R', count: 2, penalty: 0 },
  { letter: 'S', count: 3, penalty: 0 },
  { letter: 'T', count: 2, penalty: 0 },
  { letter: 'U', count: 2, penalty: 0 },
  { letter: 'V', count: 2, penalty: 0 },

  // +1 penalty letters
  { letter: 'F', count: 2, penalty: 1 },
  { letter: 'G', count: 2, penalty: 1 },
  { letter: 'L', count: 2, penalty: 1 },
  { letter: 'N', count: 2, penalty: 1 },

  // +2 penalty letters
  { letter: 'K', count: 1, penalty: 2 },
  { letter: 'Q', count: 1, penalty: 2 },
  { letter: 'W', count: 1, penalty: 2 },
  { letter: 'Y', count: 1, penalty: 2 },
  { letter: 'Z', count: 1, penalty: 2 },

  // +3 penalty letter
  { letter: 'X', count: 1, penalty: 3 },
];

// Action cards - 4 of each type (16 total)
const ACTION_TYPES: ActionCard['type'][] = ['crack_list', 'stop', 'reverse', 'swap'];
const ACTION_CARD_COUNT = 4;

/**
 * Generate the game deck (78 cards total)
 * - 62 letter cards
 * - 16 action cards
 */
export function generateDeck(): Card[] {
  const deck: Card[] = [];

  // Add letter cards
  LETTER_DISTRIBUTION.forEach(({ letter, count, penalty }) => {
    for (let i = 0; i < count; i++) {
      deck.push({
        type: 'letter',
        letter,
        penalty,
      } as LetterCard);
    }
  });

  // Add action cards
  ACTION_TYPES.forEach((actionType) => {
    for (let i = 0; i < ACTION_CARD_COUNT; i++) {
      deck.push({
        type: actionType,
      } as ActionCard);
    }
  });

  return shuffleDeck(deck);
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleDeck<T>(deck: T[]): T[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Draw N cards from the deck
 */
export function drawCards(deck: Card[], count: number): { drawn: Card[]; remaining: Card[] } {
  const drawn = deck.slice(0, count);
  const remaining = deck.slice(count);
  return { drawn, remaining };
}

/**
 * Deal cards to players
 */
export function dealCards(deck: Card[], playerCount: number, cardsPerPlayer: number) {
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  let currentDeck = [...deck];

  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let p = 0; p < playerCount; p++) {
      if (currentDeck.length > 0) {
        hands[p].push(currentDeck.shift()!);
      }
    }
  }

  return { hands, remaining: currentDeck };
}
