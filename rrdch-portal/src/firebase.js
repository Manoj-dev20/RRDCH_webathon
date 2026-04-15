import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD1utGJaYKKw7GN1r6BAH_FdMatGAXIiJk",
  authDomain: "rrdch-portal.firebaseapp.com",
  databaseURL: "https://rrdch-portal-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rrdch-portal",
  storageBucket: "rrdch-portal.firebasestorage.app",
  messagingSenderId: "530348233213",
  appId: "1:530348233213:web:89fcf086c41103736e8994"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
