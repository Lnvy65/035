import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MyPage.css';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [nextBilling, setNextBilling] = useState(null);   

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
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

                setSubscriptions(subsData);

                if (subsData.length > 0) {
                    calculateNextBilling(subsData);
                }
                
            } catch (error) {
                console.error('데이터를 불러오는 중 에러 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        const calculateNextBilling = (data) => {
            const today = new Date();
            const todayDay = today.getDate();

            // 임시로 매월 1일로 하드코딩된 데이터를 사용하므로, 실제 임박한 날짜를 찾는 로직은 나중에 데이터를 진짜 날짜 변경
            const targetSub = data.find(sub => sub.name === "유튜브 프리미엄") || data[0];
            
            if (targetSub) {
                setNextBilling({
                    date: targetSub.date, 
                    name: targetSub.name, 
                });
            }
        };

        return () => unsubscribe();
    }, [navigate]);

    const totalPrice = subscriptions.reduce((sum, sub) => sum + Number(sub.price || 0), 0);

    const categoryMap = subscriptions.reduce((map, sub) => {
        const category = sub.category || '기타';
        const price = Number(sub.price || 0);
        map[category] = (map[category] || 0) + price;
        return map;
    }, {});

    const chartLabels = Object.keys(categoryMap);
    const chartDataValues = Object.values(categoryMap);


    const chartColors = [
        '#4c6ef5', // 엔터테인먼트 (파랑)
        '#fab005', // 쇼핑 (노랑)
        '#12b886', // 음악 (초록)
        '#fa5252', // 건강 (빨강)
        '#be4bdb', // 생활 (보라)
        '#868e96', // 기타 (회색)
    ];
    const donutData = {
        labels: chartLabels,
        datasets: [
            {
                label: '지출 금액',
                data: chartDataValues,
                backgroundColor: chartColors,
                borderColor: '#ffffff', // 도넛 조각 사이 간격 색상
                borderWidth: 2,
                cutout: '75%', // 도넛 가운데 구멍 크기 (크게 뚫어야 도넛처럼 보임)
            },
        ],
    };

    const donutLegendItems = chartLabels.map((label, index) => {
        const value = chartDataValues[index];
        const percentage = Math.round((value / totalPrice) * 100);
        const color = chartColors[index];
        return { label, color, percentage };
    });

    const donutOptions = {
        plugins: {
            legend: {
                display:false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return ` ${label}: ₩ ${value.toLocaleString()}`;
                    }
                }
            }
        },
        maintainAspectRatio: false,
    };

    const handleDelete = async (id, name) =>{
        const isConfirm = window.confirm(`정말로 '${name}'를 구독목록에서 지우시겠습니까?`);

        if(isConfirm){
            try{
                await deleteDoc(doc(db, 'subscriptions', id));

                setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
            } catch(error){
                console.error(error);
                alert('삭제에 실패했습니다. 다시 시도해 주세요');
            }
        }
    }
    

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
            {/* 🌟 1. 대시보드 헤더 (인사말 - 진짜 조장님 이름 `{user.displayName}`) */}
            <div className="dashboard-header">
                <h1>안녕하세요, {user?.displayName} 님!</h1>
                <p>이번 달 구독 내역을 확인해 보세요.</p>
            </div>

            {/* 🌟 2. 상단 3단 요약 카드 영역 */}
            <div className="dashboard-summary-cards">
                {/* 카드 1: 총 월간 구독 금액 */}
                <div className="summary-card">
                    <h3>총 월간 구독 금액</h3>
                    <h2><span>₩</span> {totalPrice.toLocaleString()}</h2>
                </div>
                {/* 카드 2: 활성 구독 수 */}
                <div className="summary-card">
                    <h3>활성 구독 수</h3>
                    <h2>{subscriptions.length} <span></span></h2>
                </div>
                {/* 카드 3: 다음 결제 예정 (가공한 데이터 사용) */}
                <div className="summary-card">
                    <h3>다음 결제 예정</h3>
                    {nextBilling ? (
                        <p>{nextBilling.date} ({nextBilling.name})</p>
                    ) : (
                        <p>등록된 구독이 없습니다.</p>
                    )}
                </div>
            </div>

            {/* 🌟 3. 메인 & 사이드바 투팬 레이아웃 영역 */}
            <div className="dashboard-content-grid">
                
                {/* 🌟 [왼쪽 메인] 내 구독 목록 (Zebra 테이블) */}
                <div className="dashboard-main-left">
                    <div className="main-left-header">
                        <h3>내 구독 목록</h3>
                        <button className="add-btn" onClick={() => navigate('/market')}>+ 추가</button>
                    </div>
                    <table className="sub-table">
                        <thead>
                            <tr>
                                <th>서비스</th>
                                <th>월 요금</th>
                                <th>결제일</th>
                                <th>카테고리</th>
                                <th>상태</th>
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="service-icon-cell">
                                        {/* (일단 아이콘은 하드코딩, 나중에 데이터 추가 */}
                                        <span className="service-icon">
                                            {sub.name === '유튜브 프리미엄' && '▶️'}
                                            {sub.name === '넷플릭스 프리미엄' && '🍿'}
                                            {sub.name === '스포티파이' && '🎧'}
                                            {sub.name === '쿠팡 와우' && '🚀'}
                                            {sub.name === '디즈니+' && '🏰'}
                                            {sub.name === '개인 헬스장' && '🏋️'}
                                            {sub.name === '크리에이터 후원' && '💝'}
                                            {sub.name === '어도비' && '🎨'}
                                            {!['유튜브 프리미엄', '넷플릭스 프리미엄', '스포티파이', '쿠팡 와우', '디즈니+', '개인 헬스장', '크리에이터 후원', '어도비'].includes(sub.name) && '📁'}
                                        </span>
                                        {sub.name}
                                    </td>
                                    <td className="price-cell">₩ {Number(sub.price).toLocaleString()}</td>
                                    <td className="date-cell">{sub.date}</td>
                                    <td>{sub.category}</td>
                                    <td>
                                        <span className={`status-badge ${sub.status === '만료됨' ? 'expired' : 'active'}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="manage-btn" 
                                        onClick={() => handleDelete(sub.id, sub.name)} 
                                        style={{ backgroundColor: '#fff0f0', color: '#e03131', border: '1px solid #ffc9c9' }}>
                                            해지
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="dashboard-sidebar-right">
                    <div className="sidebar-card chart-card">
                        <h3>월간 지출 분포</h3>
                        <div className="donut-chart-container">
                            <Doughnut data={donutData} options={donutOptions} />
                            {/* 도넛 그래프 텍스트옵션, 지금 디자인이 이상해서 일단 보류 */}
                            {/* <div className="donut-legend-mini">
                                {donutLegendItems.map((item, index) => (
                                    <div key={index} className="donut-legend-item">
                                        <span className="color-dot" style={{ backgroundColor: item.color }}></span>
                                        <span className="legend-label">{item.label}</span>
                                        <span className="legend-percentage">{item.percentage}%</span>
                                    </div>
                                ))}
                            </div> */}
                        </div>
                    </div>

                    <div className="sidebar-card">
                        <h3>최근 활동 및 알림</h3>
                        <div className="activity-list">
                            <div className="activity-item">
                                <span className="activity-icon">▶️</span>
                                <div className="activity-text">
                                    <p>YouTube 정기 결제, 9,000₩ 입니다.</p>
                                    <span>11월 12일 결제</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <span className="activity-icon">🍿</span>
                                <div className="activity-text">
                                    <p>Netflx 가격 변경이 확인되었습니다.</p>
                                    <span>11월 12일 결제</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
    // return (
    //     <div className="mypage-container">
    //         <div className="dashboard-top-section">
    //             <div className="summary-cards">
    //                 <div className="card">
    //                     <h3>총 월간 구독 금액</h3>
    //                     <h2>₩ {totalPrice.toLocaleString()}</h2>
    //                 </div>
    //                 <div className="card">
    //                     <h3>활성 구독 수</h3>
    //                     <h2>{subscriptions.length}개</h2>
    //                 </div>
    //             </div>
    //             <div className="card chart-card">
    //                 <h3>카테고리별 지출 현황</h3>
    //                 <div className="chart-container">
    //                     <Doughnut data={donutData} options={donutOptions} />
    //                 </div>
    //             </div>
    //         </div>
    //         <div className="subscription-list">
    //             <div className="list-header">
    //                 <h3>내 구독 목록</h3>
    //                 <button className="add-btn" onClick={() => navigate('/market')}>+ 추가</button>
    //             </div>
    //             <table className="sub-table">
    //                 <thead><tr><th>서비스</th><th>월 요금</th><th>결제일</th><th>카테고리</th><th>상태</th><th>작업</th></tr></thead>
    //                 <tbody>
    //                     {subscriptions.map((sub) => (
    //                         <tr key={sub.id}>
    //                             <td>{sub.name}</td>
    //                             <td>₩ {Number(sub.price).toLocaleString()}</td>
    //                             <td>{sub.date}</td>
    //                             <td>{sub.category}</td>
    //                             <td><span className="status-badge">{sub.status}</span></td>
                                // <td><button className="manage-btn" 
                                //         onClick={() => handleDelete(sub.id, sub.name)} 
                                //         style={{ backgroundColor: '#fff0f0', color: '#e03131', border: '1px solid #ffc9c9' }}>
                                //             해지
                                //     </button>
    //                             </td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //         </div>
    //     </div>
    // );
}