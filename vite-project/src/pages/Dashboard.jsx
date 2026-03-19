import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MyPage.css';

import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Dashboard() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'subscriptions'));
                const subsData = [];
                querySnapshot.forEach((doc) => {
                    subsData.push({ id: doc.id, ...doc.data() });
                });
                setSubscriptions(subsData);
                
            } catch (error) {
                console.error('데이터를 불러오는 중 에러 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    const totalPrice = subscriptions.reduce((sum, sub) => sum + Number(sub.price || 0), 0);

    if (loading) {
        return (
            <div className="mypage-container">
                <div className="summary-cards">
                    <div className="card"><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-price"></div></div>
                    <div className="card"><div className="skeleton skeleton-title"></div><div className="skeleton skeleton-price"></div></div>
                </div>
                <div className="subscription-list">
                    <h3>내 구독 목록</h3>
                    <table className="sub-table">
                        <thead><tr><th>서비스</th><th>월 요금</th><th>결제일</th><th>카테고리</th><th>상태</th><th>작업</th></tr></thead>
                        <tbody>
                            {[1, 2, 3, 4].map(n => (
                                <tr key={n}>
                                    <td><div className="skeleton skeleton-text"></div></td>
                                    <td><div className="skeleton skeleton-text"></div></td>
                                    <td><div className="skeleton skeleton-text"></div></td>
                                    <td><div className="skeleton skeleton-text"></div></td>
                                    <td><div className="skeleton skeleton-badge"></div></td>
                                    <td><div className="skeleton skeleton-btn"></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="mypage-container">
            <div className="summary-cards">
                <div className="card">
                    <h3>총 월간 구독 금액</h3>
                    <h2>₩ {totalPrice.toLocaleString()}</h2>
                </div>
                <div className="card">
                    <h3>활성 구독 수</h3>
                    <h2>{subscriptions.length}개</h2>
                </div>
            </div>
            <div className="subscription-list">
                <div className="list-header">
                    <h3>내 구독 목록</h3>
                    <button className="add-btn" onClick={() => navigate('/market')}>+ 추가</button>
                </div>
                <table className="sub-table">
                    <thead><tr><th>서비스</th><th>월 요금</th><th>결제일</th><th>카테고리</th><th>상태</th><th>작업</th></tr></thead>
                    <tbody>
                        {subscriptions.map((sub) => (
                            <tr key={sub.id}>
                                <td>{sub.name}</td>
                                <td>₩ {Number(sub.price).toLocaleString()}</td>
                                <td>{sub.date}</td>
                                <td>{sub.category}</td>
                                <td><span className="status-badge">{sub.status}</span></td>
                                <td><button className="manage-btn">관리</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}