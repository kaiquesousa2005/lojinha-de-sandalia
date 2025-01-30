import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBb47gvzVDUeHw2IpMt5M7g_0EcKmv1OrM",
  authDomain: "loja-da-manu-ccec6.firebaseapp.com",
  projectId: "loja-da-manu-ccec6",
  storageBucket: "loja-da-manu-ccec6.firebasestorage.app",
  messagingSenderId: "1002360825453",
  appId: "1:1002360825453:web:ee294aabca232cb25f4164",
  measurementId: "G-1VNYJYFESF",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

