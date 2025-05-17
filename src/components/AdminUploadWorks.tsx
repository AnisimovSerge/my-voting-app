import React, { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

interface Participant {
  id: string;
  authors: string[];
  number: number;
  photoUrl?: string;
}

const AdminUploadWorks: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newAuthors, setNewAuthors] = useState(["", "", ""]);
  const [newNumber, setNewNumber] = useState("");
  const [photoLinks, setPhotoLinks] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    const fetchParticipants = async () => {
      const snap = await getDocs(collection(db, "participants"));
      const arr = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Participant));
      arr.sort((a, b) => a.number - b.number);
      setParticipants(arr);
      const links: { [id: string]: string } = {};
      arr.forEach(p => { links[p.id] = p.photoUrl || ""; });
      setPhotoLinks(links);
    };
    fetchParticipants();
  }, []);

  const handleAddParticipant = async () => {
    const authors = newAuthors.map(a => a.trim()).filter(Boolean);
    if (authors.length === 0 || !newNumber.trim()) return;
    const number = parseInt(newNumber, 10);
    if (isNaN(number)) {
      alert("Номер должен быть числом");
      return;
    }
    await addDoc(collection(db, "participants"), {
      authors,
      number,
      votes: 0,
    });
    setNewAuthors(["", "", ""]);
    setNewNumber("");
    // обновить список
    const snap = await getDocs(collection(db, "participants"));
    const arr = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Participant));
    arr.sort((a, b) => a.number - b.number);
    setParticipants(arr);
    const links: { [id: string]: string } = {};
    arr.forEach(p => { links[p.id] = p.photoUrl || ""; });
    setPhotoLinks(links);
  };

  const handlePhotoUrlChange = (id: string, value: string) => {
    setPhotoLinks(prev => ({ ...prev, [id]: value }));
  };

  const handleSavePhotoUrl = async (id: string) => {
    const url = photoLinks[id]?.trim();
    if (!url) {
      alert("Введите ссылку на фото");
      return;
    }
    await updateDoc(doc(db, "participants", id), { photoUrl: url });
    alert("Ссылка сохранена!");
    // обновить список
    const snap = await getDocs(collection(db, "participants"));
    const arr = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Participant));
    arr.sort((a, b) => a.number - b.number);
    setParticipants(arr);
  };

  return (
    <div>
      <h2>Добавить работу</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24 }}>
        {[0, 1, 2].map(i => (
          <input
            key={i}
            type="text"
            placeholder={`Автор ${i + 1}`}
            value={newAuthors[i]}
            onChange={e => {
              const arr = [...newAuthors];
              arr[i] = e.target.value;
              setNewAuthors(arr);
            }}
            className="voting-input"
            style={{ width: 140 }}
          />
        ))}
        <input
          type="number"
          placeholder="Номер работы"
          value={newNumber}
          onChange={e => setNewNumber(e.target.value)}
          className="voting-input"
          style={{ width: 120 }}
        />
        <button className="voting-btn" onClick={handleAddParticipant}>
          Добавить
        </button>
      </div>

      <h2>Работы</h2>
      <div>
        {participants.map(p => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ width: 60, fontWeight: 700 }}>№{p.number}</div>
            <div style={{ width: 260 }}>
              {Array.isArray(p.authors) && p.authors.length > 0
                ? p.authors.join(", ")
                : <span style={{ color: "#aaa" }}>Нет авторов</span>}
            </div>
            <div>
              {p.photoUrl ? (
                <img src={p.photoUrl} alt={p.authors?.join(", ") || ""} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />
              ) : (
                <span style={{ color: "#aaa" }}>Нет фото</span>
              )}
            </div>
            <input
              type="text"
              placeholder="Вставьте прямую ссылку на фото"
              value={photoLinks[p.id] || ""}
              onChange={e => handlePhotoUrlChange(p.id, e.target.value)}
              style={{ width: 260, marginLeft: 8 }}
            />
            <button className="voting-btn" style={{ marginLeft: 8 }} onClick={() => handleSavePhotoUrl(p.id)}>
              Сохранить ссылку
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUploadWorks;