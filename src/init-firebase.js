import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.firestore();
export default firebaseApp;


/*apiKey: "AIzaSyCPQctS35X29tTeVgWEkQVVD_ly56f2r2g",
  authDomain: "pinnacle-d8574.firebaseapp.com",
  databaseURL: "https://pinnacle-d8574-default-rtdb.firebaseio.com",
  projectId: "pinnacle-d8574",
  storageBucket: "pinnacle-d8574.appspot.com",
  messagingSenderId: "757821754779",
  appId: "1:757821754779:web:8b9872b3a96c4ed245a53e",
  measurementId: "G-WNVJMQHVCP"*/