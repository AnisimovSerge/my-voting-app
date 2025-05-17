//redeploy test

import React, { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Layout from "../components/Layout";

interface Participant {
  id: string;
  number: string;
  authors: string[];
  photo: string;
  votes: number;
}

const ResultsPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const snap = await getDocs(collection(db, "participants"));
      const votesSnap = await getDocs(collection(db, "votes"));
      const participantsArr: Participant[] = snap.docs.map(doc => {
        const data = doc.data();
        const votesCount = votesSnap.docs.filter(v => v.data().participantId === doc.id).length;
        return {
          id: doc.id,
          number: data.number,
          authors: data.authors,
          photo: data.photo,
          votes: votesCount,
        };
      });
      setParticipants(participantsArr);
    };
    fetchParticipants();
  }, []);

  return (
    <Layout>
      <h2 className="text-white text-2xl font-bold mb-8 mt-4 text-center">Результаты голосования</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {(() => {
          const maxVotes = Math.max(...participants.map(p => p.votes), 1);
          return participants.map(participant => (
            <div key={participant.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-72">
              <img src={`/photos/${participant.photo}`} alt={participant.number} className="w-32 h-32 object-cover rounded mb-2" />
              <div className="font-bold text-xl mb-1 text-gray-800">Кандидат {participant.number}</div>
              <div className="text-sm text-gray-600 mb-2">{participant.authors.join(", ")}</div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${(participant.votes / maxVotes) * 100}%` }}
                ></div>
              </div>
              <div className="text-lg font-bold">{participant.votes} голосов</div>
            </div>
          ));
        })()}
      </div>
    </Layout>
  );
};

export default ResultsPage;




