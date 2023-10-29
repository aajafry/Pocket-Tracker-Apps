// Import the functions we need from the firebase SDKs.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, onValue, ref, remove, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Firebase configuration credential.
const firebaseConfig = {
    apiKey: "AIzaSyAEwbYZUyKeHKyp3m9EVK224OHBxiiDPFA",
    authDomain: "expense-tracker-applicalion.firebaseapp.com",
    databaseURL: "https://expense-tracker-applicalion-default-rtdb.firebaseio.com",
    projectId: "expense-tracker-applicalion",
    storageBucket: "expense-tracker-applicalion.appspot.com",
    messagingSenderId: "76625274540",
    appId: "1:76625274540:web:f26a17d857535c85ede109"
};
 
// Initialize Firebase.
const app = initializeApp(firebaseConfig);

export { app, getDatabase, onValue, ref, remove, set };

