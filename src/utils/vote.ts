import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const SubmitVote = async (candidateId: string, token: string) => {
  await addDoc(collection(db, "votes"), {
    candidateId,
    token,
    timestamp: new Date(),
  });
};