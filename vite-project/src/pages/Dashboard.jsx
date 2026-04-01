import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../MyPage.css';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getActiveTotalPrice, getActiveCount } from '../Utils/SubscriptionUtils';
import SummaryCards from '../components/SummaryCards';
import SubscriptionTable from '../components/SubscriptionTable';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardSkeleton from '../components/DashboardSkeleton';

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

    const totalPrice = getActiveTotalPrice(subscriptions);
    const activeCount = getActiveCount(subscriptions);
    const activeSubscriptions = subscriptions.filter(sub => sub.isActive !== false);

    const categoryMap = activeSubscriptions.reduce((map, sub) => {
        const category = sub.category || '기타';
        const price = Number(sub.price || 0);
        map[category] = (map[category] || 0) + price;
        return map;
    }, {});

    const chartLabels = Object.keys(categoryMap);
    const chartDataValues = Object.values(categoryMap);


    const chartColors = [
        '#4c6ef5', // 엔터테인먼트 
        '#fab005', // 쇼핑 
        '#12b886', // 음악 
        '#fa5252', // 건강 
        '#be4bdb', // 생활 
        '#868e96', // 기타 
    ];
    const donutData = {
        labels: chartLabels,
        datasets: [
            {
                label: '지출 금액',
                data: chartDataValues,
                backgroundColor: chartColors,
                borderColor: '#ffffff', 
                borderWidth: 2,
                cutout: '75%', 
            },
        ],
    };

    const donutOptions = {
        responsive: true, 
        maintainAspectRatio: false,

        devicePixelRatio: 3,
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
    const handleToggleActive = async (subId, currentIsActive) => {
        try {
               // 기존 값이 없으면 true로 간주하고, 있으면 그 반대값(!)을 넣습니다.
               const newIsActive = currentIsActive === false ? true : false; 

               // 1. 파이어베이스 DB 업데이트
               const subRef = doc(db, 'subscriptions', subId);
               await updateDoc(subRef, {
                   isActive: newIsActive
               });

               // 2. 화면(State) 즉시 업데이트 (새로고침 없이 바로 반영되게!)
               setSubscriptions(prev => 
                   prev.map(sub => 
                       sub.id === subId ? { ...sub, isActive: newIsActive } : sub
                   )
               );
            } catch (error) {
               console.error("상태 변경 에러:", error);
               alert("상태 변경에 실패했습니다.");
            }
    };

    if (loading) {
        return <DashboardSkeleton />;
    }
    return (
        <div className="mypage-container">
            <div className="dashboard-header">
                <h1>안녕하세요, {user?.displayName} 님!</h1>
                <p>이번 달 구독 내역을 확인해 보세요.</p>
            </div>

            <SummaryCards 
                totalPrice={totalPrice} 
                activeCount={activeCount} 
                nextBilling={nextBilling} 
            />

            <div className="dashboard-content-grid">
                <div className="dashboard-main-left">
                    <div className="main-left-header">
                        <h3>내 구독 목록</h3>
                        <button className="add-btn" onClick={() => navigate('/market')}>+ 추가</button>
                    </div>
                    
                    <SubscriptionTable 
                        subscriptions={subscriptions} 
                        onToggleActive={handleToggleActive}
                        handleDelete={handleDelete} 
                    />
                </div>

                <DashboardSidebar 
                    donutData={donutData} 
                    donutOptions={donutOptions} 
                />
            </div>
        </div>
    );
}