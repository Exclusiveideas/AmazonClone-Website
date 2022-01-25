import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBs_UiK7Fg--5a_GHcWM7i0EH79AY2q30",
  authDomain: "clone-e0310.firebaseapp.com",
  projectId: "clone-e0310",
  storageBucket: "clone-e0310.appspot.com",
  messagingSenderId: "182661565715",
  appId: "1:182661565715:web:4160a724135dfb19a4dee6",
  measurementId: "G-7CZ3L123G5",
};

const app = firebase.initializeApp(firebaseConfig);

const db = getFirestore();

export { app, db };
