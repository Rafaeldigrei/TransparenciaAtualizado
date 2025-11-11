// src/services/appointmentsService.js
import { db, auth } from "../firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

export async function createAppointment({ type, detail, date, status = "Confirmada" }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não logado");

  await addDoc(collection(db, "appointments"), {
    userId: user.uid,
    type,
    detail,
    date,
    status,
    createdAt: serverTimestamp()
  });
}

export async function listMyAppointments() {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não logado");

  const q = query(collection(db, "appointments"), where("userId", "==", user.uid));
  const snap = await getDocs(q);

  const result = [];
  snap.forEach((docu) => {
    result.push({ id: docu.id, ...docu.data() });
  });
  return result;
}
