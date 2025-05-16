import React, { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, getDocs, addDoc, query, where, doc, getDoc } from "firebase/firestore";
import { useFingerprint } from "../utils/useFingerprint";
import Timer from "../components/Timer";
import "./VotingPage.css";

const PREVOTE_DURATION = 5 * 60;
const VOTING_DURATION = 30 * 60;

const VoteHeader: React.FC<{ timer?: React.ReactNode }> = ({ timer }) => (
  <header className="vote-header">
    <img src="/logo.svg" alt="ColorMix" className="vote-header-logo" />
    <h1 className="vote-header-title">Голосование ColorMix 2025</h1>
    <div className="vote-header-timer">{timer}</div>
  </header>
);

interface Participant {
  id: string;
  name: string;
  photoUrl: string;
  number: number;
  votes: number;
}

type VotingStatus = "not_started" | "prevote" | "voting" | "paused" | "ended";

const VotingPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<VotingStatus>("not_started");
  const [phase, setPhase] = useState<"prevote" | "voting" | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const fingerprint = useFingerprint();

  useEffect(() => {
    const fetchVotingSettings = async () => {
      const snap = await getDoc(doc(db, "settings", "voting"));
      if (snap.exists()) {
        const data = snap.data();
        setStatus(data.status || "not_started");
        setPhase(data.phase || null);
        setRemaining(data.remaining || 0);
      }
    };
    fetchVotingSettings();
    const interval = setInterval(fetchVotingSettings, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      const snap = await getDocs(collection(db, "participants"));
      const arr = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Participant));
      arr.sort((a, b) => a.number - b.number);
      setParticipants(arr);
      setLoading(false);
    };
    fetchParticipants();
  }, []);

  useEffect(() => {
    if (!fingerprint) return;
    const checkVote = async () => {
      const q = query(collection(db, "votes"), where("fingerprint", "==", fingerprint));
      const snap = await getDocs(q);
      if (!snap.empty) setAlreadyVoted(true);
    };
    checkVote();
  }, [fingerprint]);

  const handleVote = async (participantId: string) => {
    if (!participantId || !fingerprint || alreadyVoted) return;
    try {
      await addDoc(collection(db, "votes"), {
        participantId,
        fingerprint,
        timestamp: new Date(),
      });
      setVoteSubmitted(true);
    } catch (error) {
      alert("Ошибка при отправке голоса: " + (error as Error).message);
    }
  };

  let timerContent: React.ReactNode = null;
  if (status === "paused") {
    timerContent = <div className="voting-success">Голосование на паузе</div>;
  } else if (status === "ended") {
    timerContent = <div className="voting-success">Голосование завершено</div>;
  } else if (status === "prevote" && remaining > 0) {
    timerContent = (
      <>
        <div className="timer-label">До начала голосования:</div>
        <Timer initialSeconds={remaining} key={`prevote-${remaining}`} />
      </>
    );
  } else if (status === "voting" && remaining > 0) {
    timerContent = (
      <>
        <div className="timer-label">До конца голосования:</div>
        <Timer initialSeconds={remaining} key={`voting-${remaining}`} />
      </>
    );
  }

  if (loading) return <div className="voting-loading">Загрузка...</div>;
  if (alreadyVoted) return <div className="voting-success">Вы уже голосовали. Повторное голосование невозможно.</div>;
  if (voteSubmitted) return <div className="voting-success">Спасибо! Ваш голос учтён.</div>;
  if (status === "not_started") return <div className="voting-loading">Голосование ещё не запущено</div>;

  const votingDisabled = status !== "voting";

  return (
    <div className="voting-root">
      <VoteHeader timer={timerContent} />
      <h2 className="voting-title">Выберите участника:</h2>
      <div className="voting-grid">
        {participants.map(participant => (
          <div
            key={participant.id}
            className={`voting-card voting-card-photo${selected === participant.id ? " selected" : ""}`}
            onClick={() => !votingDisabled && setSelected(participant.id)}
            style={votingDisabled ? { opacity: 0.6, pointerEvents: "none" } : {}}
          >
            <div className="voting-card-img-wrap">
              <img src={participant.photoUrl} alt={participant.name} className="voting-card-img" />
              <div className="voting-card-overlay" />
              <div className="voting-card-info">
                <div className="voting-number">
                  №{participant.number}
                </div>
                <div className="voting-name">{participant.name}</div>
                <button
                  className="voting-btn"
                  onClick={e => {
                    e.stopPropagation();
                    setSelected(participant.id);
                    handleVote(participant.id);
                  }}
                  disabled={selected !== participant.id || voteSubmitted || votingDisabled}
                >
                  Голосовать
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingPage;