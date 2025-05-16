
import React from "react";

type Props = {
  candidates: any[];
  handleSelect: (id: string) => void;
};

const VotingGrid = ({ candidates, handleSelect }: Props) => {
  return (
    <ul className="grid grid-cols-3 gap-4 mt-4">
      {candidates.map((cand) => (
        <li key={cand.id} className="border rounded-lg shadow-md overflow-hidden relative group cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-xl"
            onClick={() => handleSelect(cand.id)}>
          <img src={cand.photo} alt={`���� ${cand.name}`} className="object-cover w-full h-48"/>
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-75 transition-opacity duration-300 flex items-center justify-center text-white font-bold uppercase tracking-widest">{cand.name}</div>
        </li>
      ))}
    </ul>
  );
};

export default VotingGrid;




