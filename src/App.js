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
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [students, setStudents] = useState([]);
  const studentsCollection = collection(db, "students");

  const fetchStudents = useCallback(async () => {
    const data = await getDocs(studentsCollection);
    setStudents(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
    );
  }, [studentsCollection]);

  const addStudent = async () => {
    if (name.trim() === "" || course.trim() === "" || yearLevel === "") return;
    await addDoc(studentsCollection, {
      name: name,
      course: course,
      yearLevel: yearLevel,
      createdAt: new Date()
    });
    setName("");
    setCourse("");
    setYearLevel("");
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    const studentDoc = doc(db, "students", id);
    await deleteDoc(studentDoc);
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="container">
      <div className="header">
        <h1>ABE Student Records</h1>
      </div>

      <div className="card">
        <div className="input-section">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <select
            value={yearLevel}
            onChange={(e) => setYearLevel(e.target.value)}
          >
            <option value="">Year Level</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          <button onClick={addStudent}>+ Save</button>
        </div>
      </div>

      <div className="card">
        <p className="notes-header">Student Records ({students.length})</p>
        {students.length === 0 ? (
          <p className="empty">No records yet. Add one above!</p>
        ) : (
          students.map((s) => (
            <div className="note" key={s.id}>
              <p><strong>{s.name}</strong> — {s.course} | {s.yearLevel}</p>
              <button onClick={() => deleteStudent(s.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;