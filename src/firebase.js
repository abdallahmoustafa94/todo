import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {  initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCI6hMynAhQhDlcRqOQrRLEuZ47KZgENnE",
    authDomain: "todo-ca1e9.firebaseapp.com",
    projectId: "todo-ca1e9",
    storageBucket: "todo-ca1e9.appspot.com",
    messagingSenderId: "655874332605",
    appId: "1:655874332605:web:d35cf4d7ab1902024624d4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    experimentalForceOwningTab: true
  });
  export const storage = getStorage(app);

