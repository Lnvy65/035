import React from 'react';
import '../MyPage.css'; // 스켈레톤 애니메이션 CSS가 있는 파일

export default function DashboardSkeleton() {
    return (
        <div className="mypage-container">
            {/* 1. 헤더 스켈레톤 */}
            <div className="dashboard-header">
                <div className="skeleton skeleton-text" style={{ width: '250px', height: '38px', marginBottom: '10px' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '200px', height: '19px' }}></div>
            </div>

            {/* 2. 상단 3단 카드 스켈레톤 */}
            <div className="dashboard-summary-cards">
                {[1, 2, 3].map(n => (
                    <div key={n} className="summary-card">
                        <div className="skeleton skeleton-text" style={{ width: '100px', marginBottom: '12px' }}></div>
                        <div className="skeleton skeleton-text" style={{ width: '150px', height: '43px' }}></div>
                    </div>
                ))}
            </div>

            {/* 3. 메인 & 사이드바 투팬 스켈레톤 */}
            <div className="dashboard-content-grid">
                
                {/* 왼쪽 메인 표 스켈레톤 */}
                <div className="dashboard-main-left">
                    <div className="main-left-header">
                        <div className="skeleton skeleton-text" style={{ width: '120px', height: '24px' }}></div>
                        <div className="skeleton skeleton-btn" style={{ width: '60px', height: '34px' }}></div>
                    </div>
                    <table className="sub-table">
                        <thead>
                            <tr>
                                <th>서비스</th><th>월 요금</th><th>결제일</th><th>카테고리</th><th>상태</th><th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 표 줄을 5개 정도 넉넉히 그려줍니다 */}
                            {[1, 2, 3, 4, 5].map(n => (
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

                {/* 오른쪽 사이드바 스켈레톤 */}
                <div className="dashboard-sidebar-right">
                    {/* 차트 스켈레톤 */}
                    <div className="sidebar-card chart-card">
                        <div className="skeleton skeleton-text" style={{ width: '100px', marginBottom: '20px' }}></div>
                        <div className="donut-chart-container" style={{ justifyContent: 'center' }}>
                            {/* 동그란 도넛 모양 스켈레톤 */}
                            <div className="skeleton" style={{ width: '160px', height: '160px', borderRadius: '50%' }}></div>
                        </div>
                    </div>
                    
                    {/* 알림 스켈레톤 */}
                    <div className="sidebar-card">
                        <div className="skeleton skeleton-text" style={{ width: '120px', marginBottom: '20px' }}></div>
                        {[1, 2].map(n => (
                            <div key={n} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <div className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '50%' }}></div>
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton skeleton-text" style={{ marginBottom: '8px' }}></div>
                                    <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}