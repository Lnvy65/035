import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MyPage.css';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import { getActiveTotalPrice } from '../Utils/SubscriptionUtils';

export default function BillingHistory() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchMySubscriptions(user.uid);
            } else {
                navigate('/login');
            }
        });

        const fetchMySubscriptions = async (uid) => {
            try {
                const q = query(collection(db, 'subscriptions'), where("userId", "==", uid));
                const querySnapshot = await getDocs(q);
                
                const subsData = [];
                querySnapshot.forEach((doc) => {
                    subsData.push({ id: doc.id, ...doc.data() });
                });
                
                // 날짜(date) 기준으로 가나다(숫자)순 정렬을 해줍니다!
                subsData.sort((a, b) => (a.date > b.date ? 1 : -1));
                setSubscriptions(subsData);
                
            } catch (error) {
                console.error('데이터를 불러오는 중 에러 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        return () => unsubscribe();
    }, [navigate]);

    const getServiceIcon = (name) => {
        const icons = {
            '유튜브 프리미엄': '▶️', '넷플릭스 프리미엄': '🍿', '스포티파이': '🎧', 
            '쿠팡 와우': '🚀', '디즈니+': '🏰', '개인 헬스장': '🏋️', 
            '크리에이터 후원': '💝', '어도비': '🎨'
        };
        return icons[name] || '💳';
    };

    if (loading) return <div className="mypage-container"><h2>결제 내역을 불러오는 중...</h2></div>;

    // const totalPrice = subscriptions.reduce((sum, sub) => sum + Number(sub.price || 0), 0);
    const totalMonthlyPrice = getActiveTotalPrice(subscriptions);
    return (
        <div className="mypage-container">
            <div className="dashboard-header">
                <h1>결제 내역 (Billing History)</h1>
                <p>이번 달 예정된 결제와 지난 결제 내역을 타임라인으로 확인하세요.</p>
            </div>

            <div className="dashboard-summary-cards" style={{ marginBottom: '30px' }}>
                <div className="summary-card" style={{ flex: 'none', width: '300px', backgroundColor: '#3b5ce8', color: 'white' }}>
                    <h3 style={{ color: '#eef2ff' }}>이번 달 총 결제 예정액</h3>
                    <h2 style={{ color: 'white' }}><span>₩</span> {totalMonthlyPrice.toLocaleString()}</h2>
                    <p style={{ color: '#c7d2fe', marginTop: '10px' }}>총 {subscriptions.length}건의 결제가 대기 중입니다.</p>
                </div>
            </div>

            <div className="billing-timeline-container">
                <h3>다가오는 결제</h3>
                <div className="billing-list">
                    {subscriptions.length === 0 ? (
                        <p className="empty-state">결제 예정인 구독 서비스가 없습니다.</p>
                    ) : (
                        subscriptions.map((sub, index) => (
                            <div key={sub.id} className="billing-item">
                                <div className="billing-date-box">
                                    <span className="billing-month">11월</span>
                                    {/* '11/12' 같은 데이터에서 뒤의 일자만 빼오거나 그대로 씁니다 */}
                                    <span className="billing-day">{sub.date.replace('11/', '').replace('매월 ', '')}</span>
                                </div>
                                
                                <div className="billing-icon-box">
                                    {getServiceIcon(sub.name)}
                                </div>
                                
                                <div className="billing-info">
                                    <h4>{sub.name}</h4>
                                    <p>{sub.category}</p>
                                </div>
                                
                                <div className="billing-price">
                                    - ₩ {Number(sub.price).toLocaleString()}
                                </div>
                                
                                <div className="billing-status">
                                    <span className="status-badge active">결제 예정</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}