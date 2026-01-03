
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC96cVRbgP7OdPoek3-1jqmikRWSmMP77I",
  authDomain: "ispost-97cab.firebaseapp.com",
  projectId: "ispost-97cab",
  storageBucket: "ispost-97cab.firebasestorage.app",
  messagingSenderId: "5730548614",
  appId: "1:5730548614:web:d7d25d4fd3d31d08710a07",
  measurementId: "G-CGX2BCXMY0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
