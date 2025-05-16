import React, { useEffect, useState } from "react";
import AdminUploadWorks from "../components/AdminUploadWorks";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import "./VotingPage.css";

const VoteHeader: React.FC<{ timer?: React.ReactNode }> = ({ timer }) => (
  <header className="vote-header">
    <img src="/logo.svg" alt="ColorMix" className="vote-header-logo" />
    <h1 className="vote-header-title">Голосование ColorMix 2025</h1>
    <div className="vote-header-timer">{timer}</div>
  </header>
);

type VotingStatus = "not_started" | "prevote" | "voting" | "paused" | "ended";

const PREVOTE_DURATION = 5 * 60; // 5 минут
const VOTING_DURATION = 30 * 60; // 30 минут

const AdminPanel: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<VotingStatus>("not_started");
  const [phase, setPhase] = useState<"prevote" | "voting" | null>(null);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const fetchStatus = async () => {
      const snap = await getDoc(doc(db, "settings", "voting"));
      if (snap.exists()) {
        const data = snap.data();
        setStatus(data.status || "not_started");
        setPhase(data.phase || null);
        setRemaining(data.remaining || 0);
      }
    };
    fetchStatus();
  }, []);

  const handleLogin = () => {
    if (password === "admin2025") setIsAuth(true);
    else alert("Неверный пароль");
  };

  const updateVoting = async (data: any) => {
    await setDoc(doc(db, "settings", "voting"), data, { merge: true });
    if (data.status) setStatus(data.status);
    if (data.phase) setPhase(data.phase);
    if (typeof data.remaining === "number") setRemaining(data.remaining);
  };

  const handleStartVoting = async () => {
    setLoading(true);
    await updateVoting({
      status: "prevote",
      phase: "prevote",
      remaining: PREVOTE_DURATION,
      lastUpdate: Date.now(),
    });
    setLoading(false);
    alert("Голосование запущено!");
  };

  const handlePauseVoting = async () => {
    setLoading(true);
    // Сохраняем оставшееся время
    const snap = await getDoc(doc(db, "settings", "voting"));
    if (snap.exists()) {
      const data = snap.data();
      const lastUpdate = data.lastUpdate || Date.now();
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdate) / 1000);
      const newRemaining = Math.max((data.remaining || 0) - elapsed, 0);
      await updateVoting({
        status: "paused",
        remaining: newRemaining,
        lastUpdate: now,
      });
    }
    setLoading(false);
  };

  const handleResumeVoting = async () => {
    setLoading(true);
    // Продолжаем с того же этапа и времени
    const snap = await getDoc(doc(db, "settings", "voting"));
    if (snap.exists()) {
      const data = snap.data();
      await updateVoting({
        status: data.phase === "prevote" ? "prevote" : "voting",
        lastUpdate: Date.now(),
      });
    }
    setLoading(false);
  };

  const handleStopVoting = async () => {
    setLoading(true);
    await updateVoting({
      status: "ended",
      phase: null,
      remaining: 0,
      lastUpdate: Date.now(),
    });
    setLoading(false);
    alert("Голосование остановлено!");
  };

  if (!isAuth) {
    return (
      <div className="voting-root">
        <VoteHeader />
        <div className="flex flex-col items-center mt-16">
          <input
            type="password"
            placeholder="Пароль администратора"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="voting-input"
            style={{
              border: "1px solid #03a9f4",
              borderRadius: 8,
              padding: "12px 16px",
              fontSize: 18,
              marginBottom: 16,
              width: 260,
              outline: "none",
            }}
          />
          <button onClick={handleLogin} className="voting-btn" style={{ width: 180 }}>
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="voting-root">
      <VoteHeader />
      <h1 className="voting-title">Админ-панель</h1>
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        <button
          onClick={handleStartVoting}
          className="voting-btn"
          disabled={loading || status === "prevote" || status === "voting" || status === "paused"}
        >
          {loading ? "Запуск..." : "Старт голосования"}
        </button>
        <button
          onClick={handlePauseVoting}
          className="voting-btn"
          disabled={loading || status !== "prevote" && status !== "voting"}
          style={{ background: "#f7b42c", color: "#fff" }}
        >
          Пауза
        </button>
        <button
          onClick={handleResumeVoting}
          className="voting-btn"
          disabled={loading || status !== "paused"}
          style={{ background: "#03a9f4", color: "#fff" }}
        >
          Продолжить
        </button>
        <button
          onClick={handleStopVoting}
          className="voting-btn"
          disabled={loading || status === "ended" || status === "not_started"}
          style={{ background: "#e53935", color: "#fff" }}
        >
          Остановить
        </button>
      </div>
      <AdminUploadWorks />
    </div>
  );
};

export default AdminPanel;