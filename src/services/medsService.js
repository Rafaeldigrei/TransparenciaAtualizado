// src/services/medsService.js
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export async function createMedication({ name, dosage, notes }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não logado");

  await addDoc(collection(db, "medications"), {
    userId: user.uid,
    name,
    dosage,
    notes,
    createdAt: serverTimestamp()
  });
}

export async function listMyMedications() {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não logado");

  const q = query(collection(db, "medications"), where("userId", "==", user.uid));
  const snap = await getDocs(q);
  const result = [];
  snap.forEach((d) => result.push({ id: d.id, ...d.data() }));
  return result;
}
