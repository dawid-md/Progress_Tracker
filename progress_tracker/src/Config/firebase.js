// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDt3Sn3dUlG61IJgzL2kT5Zgz-CmSa_zDg",
  authDomain: "progress-tracker-7fd85.firebaseapp.com",
  databaseURL: "https://progress-tracker-7fd85-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "progress-tracker-7fd85",
  storageBucket: "progress-tracker-7fd85.appspot.com",
  messagingSenderId: "323788488592",
  appId: "1:323788488592:web:5cb16840b93fb106e4fd15",
  measurementId: "G-HC0LX6JBK2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);