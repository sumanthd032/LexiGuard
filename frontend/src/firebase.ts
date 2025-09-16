import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvVbteq4ZeKuugreO_g4eAcW--XIXUimk",
  authDomain: "lexiguard-fb92e.firebaseapp.com",
  projectId: "lexiguard-fb92e",
  storageBucket: "lexiguard-fb92e.firebasestorage.app",
  messagingSenderId: "108801331237",
  appId: "1:108801331237:web:e21af53f20c203f8b6afcc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);