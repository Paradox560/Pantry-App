// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeh5I7PIKDdduwc6_A3YuwpX5c1edPlvE",
  authDomain: "inventory-management-6626b.firebaseapp.com",
  projectId: "inventory-management-6626b",
  storageBucket: "inventory-management-6626b.appspot.com",
  messagingSenderId: "934403849477",
  appId: "1:934403849477:web:359e5f33607e109c990b6c",
  measurementId: "G-JPCSPJFW7T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore }