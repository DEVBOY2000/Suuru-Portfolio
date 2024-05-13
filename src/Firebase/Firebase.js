// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2JP_w99U1tpzwVMAOXZDoU0mb3vn22Ic",
  authDomain: "portofolio-6fbe1.firebaseapp.com",
  databaseURL: "https://portofolio-6fbe1-default-rtdb.firebaseio.com",
  projectId: "portofolio-6fbe1",
  storageBucket: "portofolio-6fbe1.appspot.com",
  messagingSenderId: "468853540719",
  appId: "1:468853540719:web:505cf03a6a0b57508b4a9a",
  measurementId: "G-7BML5T12JV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const provider = new GoogleAuthProvider(app);
export const auth = getAuth(app);
