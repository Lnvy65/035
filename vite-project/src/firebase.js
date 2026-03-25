// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 데이터베이스(DB) 기능
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // 로그인/회원가입 기능

// 실제 파이어베이스 프로젝트 정보
const firebaseConfig = {
  apiKey: "AIzaSyCVEtSbHk912Hvk9_YT1PZNdQiWcXqeb6Y",
  authDomain: "react-project-035.firebaseapp.com",
  projectId: "react-project-035",
  storageBucket: "react-project-035.firebasestorage.app",
  messagingSenderId: "383896701530",
  appId: "1:383896701530:web:7e86f53a52301eb9b36663",
  measurementId: "G-43QY1939B7"
};

// 파이어베이스 엔진 시동
const app = initializeApp(firebaseConfig);

// 다른 파일(Market.jsx, Dashboard.jsx 등)에서 쓸 수 있도록 db와 auth를 수출(export)합니다.
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();