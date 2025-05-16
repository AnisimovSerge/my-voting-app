import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage-root">
      <img
        src="/logo.svg"
        alt="ColorMix"
        className="homepage-bg-logo"
        draggable={false}
      />
      <div className="homepage-content">
        <h1>Голосование ColorMix 2025</h1>
        <p>Приглашаем проголосовать за приз зрительских симпатий</p>
        <button onClick={() => navigate("/vote")}>Голосовать</button>
      </div>
    </div>
  );
};

export default HomePage;