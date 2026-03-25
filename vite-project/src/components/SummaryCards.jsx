import React from 'react';
import SummaryCard from './SummaryCard';

export default function SummaryCards({ totalPrice, activeCount, nextBilling }) {
    return (
        <>
            <div className="dashboard-summary-cards">
                <SummaryCard 
                    title="총 월간 구독 금액" 
                    value={<><span>₩</span> {totalPrice.toLocaleString()}</>} 
                />
                <SummaryCard 
                    title="활성 구독 수" 
                    value={activeCount} 
                />
                <SummaryCard 
                    title="다음 결제 예정" 
                    value={nextBilling ? `${nextBilling.date} (${nextBilling.name})` : "등록된 구독 없음"}
                />
            </div>
        </>
    );
}