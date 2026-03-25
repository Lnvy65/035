import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function DashboardSidebar({ donutData, donutOptions }) {
    return (
        <div className="dashboard-sidebar-right">
            <div className="sidebar-card chart-card">
                <h3>월간 지출 분포</h3>
                <div className="donut-chart-container">
                    <Doughnut data={donutData} options={donutOptions} />
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
                            <p>Netflix 가격 변경이 확인되었습니다.</p>
                            <span>11월 12일 결제</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}