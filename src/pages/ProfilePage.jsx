const ProfilePage = ({ user }) => {
    return (
      <div className="p-4 text-white max-w-xl mx-auto">
        <h2 className="text-2xl mb-4">Your Profile</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Best Score:</strong> {user.bestScore}</p>
        <p><strong>Best Time:</strong> {user.bestTime}s</p>
        <p><strong>Games Played:</strong> {user.gamesPlayed}</p>
        <p><strong>Wins:</strong> {user.wins}</p>
        <p><strong>Win Rate:</strong> {user.gamesPlayed > 0 ? Math.round((user.wins / user.gamesPlayed) * 100) : 0}%</p>
      </div>
    );
  };
  
  export default ProfilePage;
  