import React from "react";
import "./VotingGrid.css";

type Candidate = {
  id: string;
  name?: string;
  authors?: string[] | string;
  photoUrl: string;
  votes?: number;
  selected?: boolean;
};

type Props = {
  candidates: Candidate[];
  handleSelect: (id: string) => void;
};

const VotingGrid: React.FC<Props> = ({ candidates, handleSelect }) => (
  <div className="voting-grid">
    {candidates.map((candidate) => (
      <div
        key={candidate.id}
        className={`voting-card${candidate.selected ? " selected" : ""}`}
        onClick={() => handleSelect(candidate.id)}
      >
        <img src={candidate.photoUrl} alt={candidate.name} />
        <div className="voting-number">№{candidate.id}</div>
        <div className="voting-name">
          {candidate.authors
            ? (
                Array.isArray(candidate.authors)
                  ? candidate.authors
                  : String(candidate.authors).split(",")
              ).map((author, idx) => (
                <div key={idx}>{author.trim()}</div>
              ))
            : (candidate.name || "")}
        </div>
        {/* Можно добавить кнопку голосования, если нужно */}
      </div>
    ))}
  </div>
);

export default VotingGrid;