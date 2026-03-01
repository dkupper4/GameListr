import { auth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";

export async function isEmailInUse(email) {
  const methods = await fetchSignInMethodsForEmail(
    auth,
    email.trim().toLowerCase(),
  );
  return methods.length > 0;
}

export async function register(email, password, setUser) {
  const cred = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  setUser?.(cred.user);
  return cred.user;
}

export async function login(email, password, setUser) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  setUser?.(cred.user);
  return cred.user;
}

export async function logOut(setUser) {
  await signOut(auth);
  setUser?.(null);
}
