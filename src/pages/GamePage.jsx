import React, { useEffect, useState } from "react";
import "../styles/GamePage.css";

const colors = [
  "gray-500", "gray-600", "gray-700", "gray-800",
  "zinc-500", "zinc-600", "zinc-700", "zinc-800"
];

function GamePage() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function initGame() {
    setGameStarted(false);
    setMatchedPairs(0);
    setMoves(0);
    setIsProcessing(false);
    setShowWinMessage(false);

    const colorPairs = shuffle([...colors, ...colors]);
    const newCards = colorPairs.map((color, index) => ({
      id: index,
      color,
      flipped: false,
      matched: false
    }));
    setCards(newCards);
  }

  function handleFlip(card) {
    if (isProcessing || card.flipped || card.matched) return;

    if (!gameStarted) setGameStarted(true);

    const updatedCards = cards.map(c =>
      c.id === card.id ? { ...c, flipped: true } : c
    );
    const newFlipped = [...flippedCards, { ...card, flipped: true }];
    setCards(updatedCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      if (first.color === second.color) {
        const matched = updatedCards.map(c =>
          c.color === first.color ? { ...c, matched: true } : c
        );
        setCards(matched);
        setFlippedCards([]);
        setMatchedPairs(prev => {
          const total = prev + 1;
          if (total === colors.length) {
            setTimeout(() => setShowWinMessage(true), 600);
          }
          return total;
        });
      } else {
        setIsProcessing(true);
        setTimeout(() => {
          const resetCards = updatedCards.map(c =>
            c.id === first.id || c.id === second.id
              ? { ...c, flipped: false }
              : c
          );
          setCards(resetCards);
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Memory Game</h1>
        <p>Match the colors to win!</p>
      </header>

      <main className="game-main">
        <div className="game-info">
          <h2>Version 3</h2>
          <div className="moves-box">
            <span>Moves: </span><strong>{moves}</strong>
          </div>
          <button onClick={initGame}>Restart</button>
        </div>

        <div className="game-grid">
          {cards.map(card => (
            <div
              key={card.id}
              className={`card ${card.flipped ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
              onClick={() => handleFlip(card)}
            >
              <div className="card-inner">
                <div className={`card-front ${card.color}`}></div>
                <div className="card-back"></div>
              </div>
            </div>
          ))}
        </div>

        {showWinMessage && (
          <div className="win-message">
            <div className="win-popup">
              <div className="emoji">🎉</div>
              <h2>Congratulations!</h2>
              <p>You completed the game in <strong>{moves}</strong> moves!</p>
              <button onClick={initGame}>Play Again</button>
            </div>
          </div>
        )}
      </main>

      <footer className="game-footer">
        <p>© 2023 Memory Game | Version 3</p>
      </footer>
    </div>
  );
}

export default GamePage;




// import { useState, useEffect } from 'react';

// const emojis = ['👻', '🎃', '🧛', '🕸️', '🧟', '🦇', '☠️', '🪦'];

// const GamePage = ({ user }) => {
//   const [cards, setCards] = useState([]);
//   const [flipped, setFlipped] = useState([]);
//   const [matched, setMatched] = useState([]);
//   const [moves, setMoves] = useState(0);
//   const [time, setTime] = useState(0);
//   const [timerActive, setTimerActive] = useState(false);

//   useEffect(() => {
//     const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
//     setCards(shuffled.map((emoji, i) => ({ id: i, emoji, flipped: false })));
//     setMoves(0);
//     setTime(0);
//     setFlipped([]);
//     setMatched([]);
//     setTimerActive(true);
//   }, []);

//   useEffect(() => {
//     const interval = timerActive && setInterval(() => setTime((t) => t + 1), 1000);
//     return () => clearInterval(interval);
//   }, [timerActive]);

//   const handleFlip = (id) => {
//     if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
//     const newFlipped = [...flipped, id];
//     setFlipped(newFlipped);

//     if (newFlipped.length === 2) {
//       setMoves((m) => m + 1);
//       const [a, b] = newFlipped;
//       if (cards[a].emoji === cards[b].emoji) {
//         setMatched([...matched, a, b]);
//         setFlipped([]);
//       } else {
//         setTimeout(() => setFlipped([]), 1000);
//       }
//     }
//   };

//   useEffect(() => {
//     if (matched.length === cards.length && cards.length > 0) {
//       setTimerActive(false);
//       const score = 1000 - (moves * 10 + time);
//       alert(`You win! Score: ${score}`);

//       const users = JSON.parse(localStorage.getItem('users')) || [];
//       const index = users.findIndex((u) => u.username === user.username);
//       if (index !== -1) {
//         const updated = { ...users[index], gamesPlayed: users[index].gamesPlayed + 1, wins: users[index].wins + 1 };
//         if (score > updated.bestScore) {
//           updated.bestScore = score;
//           updated.bestTime = time;
//         }
//         users[index] = updated;
//         localStorage.setItem('users', JSON.stringify(users));
//         localStorage.setItem('currentUser', JSON.stringify(updated));
//       }
//     }
//   }, [matched]);

//   return (
//     <div className="text-white p-4 max-w-4xl mx-auto">
//       <h2 className="text-2xl mb-4">Memory Match</h2>
//       <p>Moves: {moves} | Time: {time}s</p>
//       <div className="grid grid-cols-4 gap-3 mt-4">
//         {cards.map((card, i) => (
//           <div
//             key={card.id}
//             onClick={() => handleFlip(i)}
//             className={`h-20 text-3xl flex items-center justify-center cursor-pointer bg-gray-900 rounded ${flipped.includes(i) || matched.includes(i) ? 'bg-purple-700' : ''}`}
//           >
//             {(flipped.includes(i) || matched.includes(i)) ? card.emoji : '❓'}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GamePage;