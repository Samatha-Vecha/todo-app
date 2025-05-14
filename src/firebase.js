// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfXRqgUQI07ofITGR0MYh_ub2C57aonU0",
  authDomain: "fullstackcoursedb.firebaseapp.com",
  projectId: "fullstackcoursedb",
  storageBucket: "fullstackcoursedb.firebasestorage.app",
  messagingSenderId: "1012413314589",
  appId: "1:1012413314589:web:8a46b3698ee4859454f8f4",
  measurementId: "G-MH5Q21PVED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };