const ScoreboardPage = () => {
    const users = (JSON.parse(localStorage.getItem('users')) || [])
      .filter(u => u.bestScore > 0)
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, 10);
  
    return (
      <div className="p-4 text-white max-w-xl mx-auto">
        <h2 className="text-2xl mb-4">Top Scores</h2>
        <ul className="space-y-2">
          {users.map((u, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span>{u.username}</span>
              <span>{u.bestScore} pts ({u.bestTime}s)</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ScoreboardPage;

  