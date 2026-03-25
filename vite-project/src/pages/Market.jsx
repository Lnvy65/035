import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Market.css';
import { auth, db } from '../firebase'; 
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Market() {
    const navigate = useNavigate();

    const [customName, setCustomName] = useState('');
    const [customPrice, setCustomPrice] = useState('');
    const [customDate, setCustomDate] = useState('');
    const [customCategory, setCustomCategory] = useState('기타');

    const [customIcon, setCustomIcon] = useState('💳');
    const availableIcons = ['🏠', '📚', '🐶', '💖', '🎓', '🏥', '🎮', '🛒', '💳', '📁'];


    const officialServices = [
        { id: 1, name: '넷플릭스 프리미엄', price: 17000, category: '엔터테인먼트', icon: '🍿' },
        { id: 2, name: '유튜브 프리미엄', price: 14900, category: '엔터테인먼트', icon: '▶️' },
        { id: 3, name: '디즈니+', price: 9900, category: '엔터테인먼트', icon: '🏰' },
        { id: 4, name: '쿠팡 와우', price: 4990, category: '쇼핑', icon: '🚀' },
        { id: 5, name: '스포티파이', price: 10900, category: '음악', icon: '🎧' },
        { id: 6, name: '멜론', price: 7900, category: '음악', icon: '🍈' },
    ];

    const saveSubscriptionToDB = async (serviceData) => {
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
                name: serviceData.name,
                price: Number(serviceData.price),
                category: serviceData.category,
                status: '활성',
                date: serviceData.date,
                userId: user.uid,
                createdAt: new Date(),
                icon: serviceData.icon || '📁'
            });

            alert(`${serviceData.name} 구독이 내 목록에 추가되었습니다!`);
            navigate('/');
        }catch (error) {
            console.error('insert error:', error);
            alert(' 추가에 실패했습니다.');
        }
    };

    const handleOfficialSubscribe = (service) => {
        saveSubscriptionToDB({ ...service, date: '매월 1일' }); // 임시 결제일
    };

    const handleCustomSubscribe = (e) => {
        e.preventDefault(); 
        if (!customName.trim() || !customPrice || !customDate.trim()) {
            alert("서비스 이름, 월 요금, 결제일을 모두 입력해 주세요!");
            return;
        }
        if(customPrice !== Number){
            alert("가격은 숫자로 적어주세요!");
            return;
        }
        saveSubscriptionToDB({
            name: customName,
            price: customPrice,
            category: customCategory,
            date: customDate,
            icon: customIcon,
        });
    };

    return (
        <div className="market-container">
            <div className="market-header">
                <h2>어떤 서비스를 구독 중이신가요?</h2>
                <p>클릭 한 번으로 내 구독 목록에 추가해 보세요.</p>
            </div>
            
                <div className="custom-sub-section">
                <h3>✍️ 나만의 구독 직접 추가하기</h3>
                <div className="icon-picker">
                <   label>아이콘:</label>
                    <div className="available-icons">
                        {availableIcons.map(icon => (
                            <button 
                                key={icon} 
                                type="button" 
                                className={`icon-btn ${customIcon === icon ? 'selected' : ''}`}
                                onClick={() => setCustomIcon(icon)}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
                <form className="custom-sub-form" onSubmit={handleCustomSubscribe}>
                    <input 
                        type="text" 
                        placeholder="서비스 이름" 
                        value={customName} 
                        onChange={(e) => setCustomName(e.target.value)} 
                    />
                    <input 
                        type="number" 
                        placeholder="월 요금 (원)" 
                        value={customPrice} 
                        onChange={(e) => setCustomPrice(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="결제일 (예: 15일, 11/20)" 
                        value={customDate} 
                        onChange={(e) => setCustomDate(e.target.value)} 
                    />
                    <select value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}>
                        <option value="엔터테인먼트">엔터테인먼트</option>
                        <option value="음악">음악</option>
                        <option value="쇼핑">쇼핑</option>
                        <option value="건강">건강</option>
                        <option value="유틸리티">유틸리티</option>
                        <option value="생활">생활</option>
                        <option value="기타">기타</option>
                    </select>
                    <button type="submit" className="custom-add-btn">+ 추가</button>
                </form>
            </div>

            <div className="service-grid">
                {officialServices.map((service) => (
                    <div className="service-card" key={service.id}>
                        <div className="service-icon">{service.icon}</div>
                        <h3 className="service-name">{service.name}</h3>
                        <p className="service-price">월 {service.price.toLocaleString()}원</p>
                        <button 
                            className="subscribe-btn"
                            onClick={() => handleOfficialSubscribe(service)}
                        >
                            + 추가하기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}