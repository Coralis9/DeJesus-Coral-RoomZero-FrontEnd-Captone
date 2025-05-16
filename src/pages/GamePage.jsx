import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../styles/GamePage.css";


const colors = [
  "gray-500", "gray-600", "gray-700", "gray-800",
  "zinc-500", "zinc-600", "zinc-700", "zinc-800"
];

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const GamePage = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [win, setWin] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
  
    useEffect(() => {
      initGame();
    }, []);
  
    useEffect(() => {
      let interval;
      if (isRunning) {
        interval = setInterval(() => {
          setTimer((prev) => prev + 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isRunning]);
  
    const initGame = () => {
      const colorPairs = shuffleArray([...COLORS, ...COLORS]);
      const newCards = colorPairs.map((color, index) => ({
        id: index,
        color,
        flipped: false,
        matched: false,
      }));
      setCards(newCards);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setWin(false);
      setTimer(0);
      setIsRunning(false);
    };
  
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
  
    const handleCardClick = (card) => {
      if (flipped.length === 2 || card.flipped || card.matched) return;
  
      const updatedCards = cards.map((c) =>
        c.id === card.id ? { ...c, flipped: true } : c
      );
  
      const newFlipped = [...flipped, card];
  
      if (!isRunning) setIsRunning(true);
  
      setCards(updatedCards);
      setFlipped(newFlipped);
  
      if (newFlipped.length === 2) {
        setMoves((prev) => prev + 1);
        const [first, second] = newFlipped;
  
        if (first.color === second.color) {
          const matchedIds = [first.id, second.id];
          setMatched((prev) => [...prev, ...matchedIds]);
          setFlipped([]);
  
          if (matched.length + 2 === COLORS.length * 2) {
            setIsRunning(false);
            setTimeout(() => {
              setWin(true);
              saveGameResult();
            }, 500);
          }
        } else {
          setTimeout(() => {
            const resetCards = updatedCards.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, flipped: false }
                : c
            );
            setCards(resetCards);
            setFlipped([]);
          }, 1000);
        }
      }
    };
  
    const saveGameResult = async () => {
      const userId = localStorage.getItem('userId') || 'guest';
      const duration = formatTime(timer);
      try {
        await axios.post('http://localhost:5000/api/gameHistory', {
          userId,
          moves,
          duration,
        });
      } catch (err) {
        console.error('Failed to save game result:', err);
      }
    };
  
    return (
      <div className="game-container">
        <header>
          <h1>Memory Match</h1>
          <p>Match all the spooky cards!</p>
        </header>
  
        <section className="stats">
          <div>Moves: {moves}</div>
          <div>Time: {formatTime(timer)}</div>
          <button onClick={initGame}>Restart</button>
        </section>
  
        <section className="grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${card.flipped || card.matched ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-inner">
                <div
                  className="card-front"
                  style={{ backgroundColor: card.color }}
                ></div>
                <div className="card-back"></div>
              </div>
            </div>
          ))}
        </section>
  
        {win && (
          <div className="modal">
            <div className="modal-content">
              <h2>🎉 You Win!</h2>
              <p>Completed in {moves} moves and {formatTime(timer)}.</p>
              <button onClick={initGame}>Play Again</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default GamePage;
  