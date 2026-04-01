import React from 'react';
import ServiceIcons from './ServiceIcons';

export default function SubscriptionTable({ subscriptions, handleDelete, onToggleActive }) {
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
                            <ServiceIcons name={sub.name} iconFromDB={sub.icon} />
                            {sub.name}
                        </td>
                        <td className="price-cell" data-label="월 요금">₩ {Number(sub.price).toLocaleString()}</td>
                        <td className="date-cell" data-label="결제일">{sub.date}</td>
                        <td data-label="카테고리">{sub.category}</td>
                        <td data-label="상태">
                            <button 
                                className={`status-toggle-btn ${sub.isActive !== false ? 'active' : 'inactive'}`}
                                onClick={() => onToggleActive(sub.id, sub.isActive)}
                            >
                                {sub.isActive !== false ? '✅ 활성' : '⏸️ 비활성'}
                            </button>
                        </td>
                        <td data-label="작업">
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