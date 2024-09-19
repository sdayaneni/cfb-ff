// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence} from 'firebase/auth/react-native';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAw9GxkQKaTaem7w5Yrs6WwpL2ztJra5ko",
  authDomain: "cfb-ff.firebaseapp.com",
  projectId: "cfb-ff",
  storageBucket: "cfb-ff.appspot.com",
  messagingSenderId: "981536250611",
  appId: "1:981536250611:web:33d7f0e596cbc490463586",
  measurementId: "G-VG0XHVV650"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage)});
const db = getFirestore(app);
export {db, auth};