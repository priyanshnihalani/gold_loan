firebase.js is ignored as it contains appId and bucketId, the project includes

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const firestoredb = getFirestore()
export const provider = new GoogleAuthProvider()
