// src/services/examsService.js
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export async function createExam({ name, description, date }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não logado");

  await addDoc(collection(db, "exams"), {
    userId: user.uid,
    name,
    description,
    date,
    createdAt: serverTimestamp()
  });
}

export async function listMyExams() {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não logado");

  const q = query(collection(db, "exams"), where("userId", "==", user.uid));
  const snap = await getDocs(q);
  const result = [];
  snap.forEach((d) => result.push({ id: d.id, ...d.data() }));
  return result;
}
