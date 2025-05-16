import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

const AdminUploadWorks: React.FC = () => {
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [number, setNumber] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!photoUrl || !name || !number) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "participants"), {
        name,
        photoUrl,
        number: Number(number),
        votes: 0,
      });
      setPhotoUrl("");
      setName("");
      setNumber("");
      alert("Работа успешно добавлена!");
    } catch (error) {
      alert("Ошибка: " + (error as Error).message);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 32, padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16 }}>Добавить работу</h2>
      <input
        type="number"
        placeholder="Номер стенда"
        value={number}
        min={1}
        max={99}
        onChange={e => setNumber(e.target.value ? Number(e.target.value) : "")}
        className="voting-input"
        style={{
          border: "1px solid #03a9f4",
          borderRadius: 8,
          padding: "12px 16px",
          fontSize: 16,
          marginBottom: 16,
          width: "100%",
          outline: "none",
        }}
      />
      <input
        type="text"
        placeholder="Имя участника"
        value={name}
        onChange={e => setName(e.target.value)}
        className="voting-input"
        style={{
          border: "1px solid #03a9f4",
          borderRadius: 8,
          padding: "12px 16px",
          fontSize: 16,
          marginBottom: 16,
          width: "100%",
          outline: "none",
        }}
      />
      <input
        type="text"
        placeholder="Ссылка на изображение (URL)"
        value={photoUrl}
        onChange={e => setPhotoUrl(e.target.value)}
        className="voting-input"
        style={{
          border: "1px solid #03a9f4",
          borderRadius: 8,
          padding: "12px 16px",
          fontSize: 16,
          marginBottom: 16,
          width: "100%",
          outline: "none",
        }}
      />
      <button
        className="voting-btn"
        style={{ width: "100%" }}
        onClick={handleUpload}
        disabled={loading || !photoUrl || !name || !number}
      >
        {loading ? "Добавление..." : "Добавить"}
      </button>
      <div style={{marginTop: 12, fontSize: 13, color: "#666"}}>
        <div>Загрузите фото на imgur.com, postimages.org, Google Диск или Яндекс Диск и вставьте прямую ссылку на изображение.</div>
      </div>
    </div>
  );
};

export default AdminUploadWorks;