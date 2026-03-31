import { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const notesCollection = collection(db, "notes");

  const fetchNotes = useCallback(async () => {
    const data = await getDocs(notesCollection);
    setNotes(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
    );
  }, [notesCollection]);

  const addNote = async () => {
    if (note.trim() === "") return;
    await addDoc(notesCollection, {
      text: note,
      createdAt: new Date()
    });
    setNote("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className="container">
      <div className="header">
        <h1>ABE Frontend vs Backend</h1>
      </div>

      <div className="card">
        <div className="input-section">
          <input
            type="text"
            placeholder="Write a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />
          <button onClick={addNote}>+ Add</button>
        </div>
      </div>

      <div className="card">
        <p className="notes-header">Your Notes ({notes.length})</p>
        {notes.length === 0 ? (
          <p className="empty">No notes yet. Add one above!</p>
        ) : (
          notes.map((n) => (
            <div className="note" key={n.id}>
              <p>{n.text}</p>
              <button onClick={() => deleteNote(n.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;