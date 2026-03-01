import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// const firebaseConfig = process.env.NODE_ENV === 'production' ? {
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: "",
//   appId: "", 
//   measurementId: ""
// } : {
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "com",
//   messagingSenderId: "",
//   appId: "",
//   measurementId: ""
// }\

const firebaseConfig = {
  apiKey: "AIzaSyBe_UpQejhjzyNoGDPtlI6OV0GPR1Pa8To",
  authDomain: "gamelistr-70e63.firebaseapp.com",
  projectId: "gamelistr-70e63",
  storageBucket: "gamelistr-70e63.firebasestorage.app",
  messagingSenderId: "606698072138",
  appId: "1:606698072138:web:9065cadb84a430dc631eb3",
  measurementId: "G-JRF9N1KQHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getFirestore(app);
export const analytics = () => getAnalytics(app);

export default app