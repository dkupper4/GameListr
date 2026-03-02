import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { database } from "./Firebase";

export async function saveUserList({ uid, name, tierGames, stagedGames }) {
  if (!uid) throw new Error("No user id");
  if (!name.trim()) throw new Error("Name is required");

  const listsRef = collection(database, "users", uid, "lists");
  const docRef = await addDoc(listsRef, {
    name: name.trim(),
    tierGames,
    stagedGames,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getUserLists(uid) {
  const listsRef = collection(database, "users", uid, "lists");
  const q = query(listsRef, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
