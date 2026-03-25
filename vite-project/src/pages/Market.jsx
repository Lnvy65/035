import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Market.css';

import { auth, db } from '../firebase'; 
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Market() {
    const navigate = useNavigate();

    const officialServices = [
        { id: 1, name: '넷플릭스 프리미엄', price: 17000, category: '엔터테인먼트', icon: '🍿' },
        { id: 2, name: '유튜브 프리미엄', price: 14900, category: '엔터테인먼트', icon: '▶️' },
        { id: 3, name: '디즈니+', price: 9900, category: '엔터테인먼트', icon: '🏰' },
        { id: 4, name: '쿠팡 와우', price: 4990, category: '쇼핑', icon: '🚀' },
        { id: 5, name: '스포티파이', price: 10900, category: '음악', icon: '🎧' },
        { id: 6, name: '멜론', price: 7900, category: '음악', icon: '🍈' },
    ];

    // 구독 버튼을 눌렀을 때 실행되는 함수
    const handleSubscribe = async (service) => {
        try{
            const user = auth.currentUser;

            if(!user){
                alert("로그인을 먼저 해주세요.");
                navigate('/login');
                return;
            }

            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);

            if(!userSnap.exists()){
                alert("삭제된 계정입니다.");
                await signOut(auth);
                navigate('/login');
                return;
            }

            await addDoc(collection(db,'subscriptions'),{
                name: service.name,
                price: service.price,
                category: service.category,
                status: '활성',
                date: '매월 1일', // 일단 결제일은 임의로 고정
                userId: user.uid,
                createdAt: new Date()
            });

            alert(`${service.name} 구독이 내 목록에 추가되었습니다!`);
            navigate('/');
        }catch (error) {
            console.error('insert error:', error);
            alert(' 추가에 실패했습니다.');
        }
    };

    return (
        <div className="market-container">
            <div className="market-header">
                <h2>어떤 서비스를 구독 중이신가요?</h2>
                <p>클릭 한 번으로 내 구독 목록에 추가해 보세요.</p>
            </div>
            
            <div className="service-grid">
                {officialServices.map((service) => (
                    <div className="service-card" key={service.id}>
                        <div className="service-icon">{service.icon}</div>
                        <h3 className="service-name">{service.name}</h3>
                        <p className="service-price">월 {service.price.toLocaleString()}원</p>
                        <button 
                            className="subscribe-btn"
                            onClick={() => handleSubscribe(service)}
                        >
                            + 추가하기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}