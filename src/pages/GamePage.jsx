import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/GamePage.css"; // Make sure this file exists and contains custom styles

const API = axios.create({ baseURL: "http://localhost:3000" }); // Adjust if needed

const colors = [
  "gray500", "gray600", "gray700", "gray800",
  "zinc500", "zinc600", "zinc700", "zinc800"
];

function GamePage({ user }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (timerStarted) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 59) {
            setMinutes((min) => min + 1);
            return 0;
          }
          return prevSec + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerStarted]);

  const initGame = () => {
    setTimerStarted(false);
    clearInterval(timerRef.current);
    setMoves(0);
    setMatchedPairs(0);
    setMinutes(0);
    setSeconds(0);
    setShowWinModal(false);

    const doubled = [...colors, ...colors];
    const shuffled = doubled.sort(() => 0.5 - Math.random());

    const cardObjects = shuffled.map((color, index) => ({
      id: index,
      color,
      flipped: false,
      matched: false
    }));

    setCards(cardObjects);
    setFlippedCards([]);
  };

  const handleCardClick = (card) => {
    if (isProcessing || card.flipped || card.matched) return;

    if (!timerStarted) setTimerStarted(true);

    const updatedCards = [...cards];
    const currentCard = { ...card, flipped: true };
    updatedCards[card.id] = currentCard;

    const newFlipped = [...flippedCards, currentCard];
    setCards(updatedCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsProcessing(true);

      setTimeout(() => {
        const [c1, c2] = newFlipped;
        if (c1.color === c2.color) {
          updatedCards[c1.id].matched = true;
          updatedCards[c2.id].matched = true;
          setMatchedPairs((prev) => prev + 1);

          if (matchedPairs + 1 === colors.length) {
            clearInterval(timerRef.current);
            setShowWinModal(true);
            submitGameResult(user?._id, moves + 1, minutes, seconds);
          }
        } else {
          updatedCards[c1.id].flipped = false;
          updatedCards[c2.id].flipped = false;
        }

        setCards(updatedCards);
        setFlippedCards([]);
        setIsProcessing(false);
      }, 800);
    }
  };

  const submitGameResult = (userId, moves, minutes, seconds) => {
    if (!userId) return;
    API.post("/gameHistory", {
      userId,
      moves,
      timeMinutes: minutes,
      timeSeconds: seconds,
      date: new Date()
    })
      .then((res) => console.log("Game result saved:", res.data))
      .catch((err) => console.error("Failed to save game result", err));
  };

  return (
    <div className="game-page">
      <header className="header">
        <h1>Memory Match Game</h1>
        <div className="stats">
          <span>Moves: {moves}</span>
          <span>Time: {minutes}m {seconds}s</span>
        </div>
        <button className="restart-btn" onClick={initGame}>Restart</button>
      </header>

      <main className="game-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className={`card-front ${card.color}`}></div>
              <div className="card-back"></div>
            </div>
          </div>
        ))}
      </main>

      {showWinModal && (
        <div className="modal-overlay">
          <div className="win-modal">
            <h2>🎉 You Won!</h2>
            <p>You completed the game in {moves} moves.</p>
            <p>Time: {minutes}m {seconds}s</p>
            <button onClick={initGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;