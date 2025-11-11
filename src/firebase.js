// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcbRP6OOxxkumdQavkDD7Q1CfUP8z9A0I",
  authDomain: "transparenciasaudepub.firebaseapp.com",
  projectId: "transparenciasaudepub",
  storageBucket: "transparenciasaudepub.appspot.com", // <-- corrige aqui
  messagingSenderId: "961012371733",
  appId: "1:961012371733:web:d89ff12936d2a4d374d91c",
  measurementId: "G-K3LQD4MCC7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
