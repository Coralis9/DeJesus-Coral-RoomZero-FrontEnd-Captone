import { useState, useEffect } from 'react';

const emojis = ['👻', '🎃', '🧛', '🕸️', '🧟', '🦇', '☠️', '🪦'];

const GamePage = ({ user }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((emoji, i) => ({ id: i, emoji, flipped: false })));
    setMoves(0);
    setTime(0);
    setFlipped([]);
    setMatched([]);
    setTimerActive(true);
  }, []);

  useEffect(() => {
    const interval = timerActive && setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleFlip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].emoji === cards[b].emoji) {
        setMatched([...matched, a, b]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setTimerActive(false);
      const score = 1000 - (moves * 10 + time);
      alert(`You win! Score: ${score}`);

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const index = users.findIndex((u) => u.username === user.username);
      if (index !== -1) {
        const updated = { ...users[index], gamesPlayed: users[index].gamesPlayed + 1, wins: users[index].wins + 1 };
        if (score > updated.bestScore) {
          updated.bestScore = score;
          updated.bestTime = time;
        }
        users[index] = updated;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updated));
      }
    }
  }, [matched]);

  return (
    <div className="text-white p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Memory Match</h2>
      <p>Moves: {moves} | Time: {time}s</p>
      <div className="grid grid-cols-4 gap-3 mt-4">
        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => handleFlip(i)}
            className={`h-20 text-3xl flex items-center justify-center cursor-pointer bg-gray-900 rounded ${flipped.includes(i) || matched.includes(i) ? 'bg-purple-700' : ''}`}
          >
            {(flipped.includes(i) || matched.includes(i)) ? card.emoji : '❓'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePage;