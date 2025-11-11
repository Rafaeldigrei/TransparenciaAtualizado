// src/services/authService.js
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Cria um novo usuário no Firebase Auth e salva seus dados no Firestore.
 */
export async function signUp(email, password, extraData = {}) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      ...extraData,
      createdAt: new Date().toISOString(),
    });

    return cred.user;
  } catch (error) {
    console.error("Erro no signUp:", error);
    throw error;
  }
}

/**
 * Faz login com e-mail e senha no Firebase Auth.
 */
export async function signIn(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (error) {
    console.error("Erro no signIn:", error);
    throw error;
  }
}

/**
 * Busca o perfil do usuário logado no Firestore.
 */
export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    return null;
  }
}

/**
 * Desloga o usuário autenticado.
 */
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao sair:", error);
  }
}

/**
 * Ouve mudanças no estado de autenticação (login/logout).
 * Retorna uma função para cancelar a escuta quando não for mais necessária.
 */
export function listenAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
