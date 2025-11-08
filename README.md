# 🎮 Cracklist Game

**Petit Bac meets UNO** - A multiplayer word game where players race to get rid of their cards by finding words that match a category.

## 🎯 Game Rules

### Setup
- Each player receives **8 cards** (letter cards or action cards)
- A category card is drawn with 3 categories, a player chooses one
- Goal: Be the first to get rid of all your cards

### Turn-based Gameplay
- Players play **in turns** (clockwise)
- Each player has **20 seconds** to play
- On your turn, you must either:
  - Play a **LETTER card** and give a word starting with that letter for the current category
  - Play an **ACTION card**

### If You Fail
- If you give a wrong answer, a duplicate answer, or exceed 20 seconds
- You must **draw 1 card**

### Action Cards

**CRACK LIST**: Change the category
- Choose a new category card and select one of the 3 categories
- Cannot finish with this card

**STOP**: Next player skips their turn

**REVERSE**: Reverses the play direction

**SWAP**: Exchange your entire hand with another player
- If you finish with SWAP, the other player wins!

### Bonus Letter Cards (+1, +2, +3)
Difficult letters give penalties to opponents:
- **+1** (F, G, L, N): Make an opponent draw 1 card
- **+2** (K, Q, W, Y, Z): Make an opponent draw 2 cards
- **+3** (X): Make an opponent draw 3 cards

### End of Round
- First player to play their last card wins the round
- Winner chooses the category for next round
- **Play 3 rounds to win the game**

## 🚀 Tech Stack

- **React** + **TypeScript** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **PeerJS** - P2P multiplayer
- **PWA** - Progressive Web App support
- **GitHub Pages** - Deployment

## 🛠️ Development

### Install dependencies
```bash
npm install
```

### Run dev server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📦 Project Structure

```
src/
├── components/        # React components
│   ├── Lobby.tsx
│   ├── GameBoard.tsx
│   ├── PlayerHand.tsx
│   ├── Timer.tsx
│   ├── CategoryDisplay.tsx
│   ├── CategoryChoice.tsx
│   ├── ActionModal.tsx
│   ├── RoundEnd.tsx
│   └── GameEnd.tsx
├── hooks/
│   └── usePeerConnection.ts
├── store/
│   └── gameStore.ts
├── types/
│   └── game.ts
├── utils/
│   ├── deck.ts
│   ├── categories.ts
│   ├── gameLogic.ts
│   └── validation.ts
└── App.tsx
```

## 🎲 Game Features

- **P2P Multiplayer**: Connect with friends using room codes
- **Real-time sync**: All players see the same game state
- **20-second timer**: Keep the game moving
- **78 category cards**: Each with 3 different categories
- **78 game cards**: Letters + action cards
- **Smart validation**: Check for duplicates and correct letters
- **Responsive design**: Play on desktop or mobile

## 🌐 Deployment

The game is automatically deployed to GitHub Pages on every push to main/master.

Configure GitHub Pages:
1. Go to repository Settings
2. Navigate to Pages
3. Source: GitHub Actions

## 📝 License

MIT

## 🎉 Credits

Created with React, TypeScript, and lots of ☕
