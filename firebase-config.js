// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgE_oCbwgLj5Mm-Ygei2m7lPMYiDBNMfQ",
  authDomain: "blogwebsite-ca598.firebaseapp.com",
  projectId: "blogwebsite-ca598",
  storageBucket: "blogwebsite-ca598.firebasestorage.app",
  messagingSenderId: "1064612414199",
  appId: "1:1064612414199:web:1486906f6abc2c0c6589f2",
};

// Initialize Firebase
let app;

let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { auth, db }; 