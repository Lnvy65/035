import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

import { auth, provider, db } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Login() {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user; 

            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    createdAt: new Date()
                });
                console.log("회원가입 완료!");
            }

            alert(`${user.displayName}님 환영합니다!`);
            
            navigate('/'); 

        } catch (error) {
            console.error("로그인 실패:", error);
            alert("로그인에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>SubHub 시작하기</h2>
                <p>내 모든 구독을 한 곳에서 스마트하게 관리하세요.</p>
                <button className="google-login-btn" onClick={handleGoogleLogin}>
                    Google 계정으로 로그인
                </button>
            </div>
        </div>
    );
}