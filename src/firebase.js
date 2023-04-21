import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

//firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJb3Gj4EkaqvDMkdvgGDZGWhmB3ne7sCc",
    authDomain: "chat-app-6fc9b.firebaseapp.com",
    projectId: "chat-app-6fc9b",
    storageBucket: "chat-app-6fc9b.appspot.com",
    messagingSenderId: "874843425210",
    appId: "1:874843425210:web:8c7195e673aaec13d47583"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();