import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", 
  
});

export default API;

import API from "../api/axios";
import { useEffect, useState } from "react";

function GamePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/Spooky23/Pumkin4040!") 
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  return (
    <div>
      <h1>Welcome {user ? user.username : "Player"}!</h1>
    </div>
  );
}

function submitGameResult(userId, moves, timeInSeconds) {
    API.post("/gameHistory", {
      userId,
      moves,
      time: timeInSeconds,
      date: new Date(),
    })
      .then((res) => {
        console.log("Game result saved!", res.data);
      })
      .catch((err) => {
        console.error("Error saving game:", err);
      });
  }