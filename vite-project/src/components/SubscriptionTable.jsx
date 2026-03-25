import React from 'react';

export default function SubscriptionTable({ subscriptions, handleDelete }) {
    const getServiceIcon = (name) => {
        const icons = {
            '유튜브 프리미엄': '▶️',
            '넷플릭스 프리미엄': '🍿',
            '스포티파이': '🎧',
            '쿠팡 와우': '🚀',
            '디즈니+': '🏰',
            '개인 헬스장': '🏋️',
            '크리에이터 후원': '💝',
            '어도비': '🎨',
            '멜론':'🍈',
        };
        return icons[name] || '📁';
    };

    return (
        <table className="sub-table">
            <thead>
                <tr>
                    <th>서비스</th><th>월 요금</th><th>결제일</th>
                    <th>카테고리</th><th>상태</th><th>작업</th>
                </tr>
            </thead>
            <tbody>
                {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                        <td className="service-icon-cell">
                            <span className="service-icon">{getServiceIcon(sub.name)}</span>
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
                            <button 
                                className="manage-btn" 
                                onClick={() => handleDelete(sub.id, sub.name)} 
                                style={{ backgroundColor: '#fff0f0', color: '#e03131', border: '1px solid #ffc9c9' }}
                            >
                                해지
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}