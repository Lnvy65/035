import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Login from './pages/Login';
import Admin from './pages/Admin';
import BillingHistory from './pages/BillingHistory';

import './App.css'; 

// 임시 페이지들
const MySubscriptions = () => <div className="page-content"><h1>My Subscriptions 페이지</h1></div>;

// 에러 페이지용 임시 컴포넌트 
const NotFound = () => (
    <div className="page-content">
        <h1>404 - 페이지를 찾을 수 없습니다</h1>
        <p>요청하신 주소가 잘못되었거나 삭제되었습니다.</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">
                <Sidebar />
                <div className="main-wrapper">
                    <div className="content-area">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/subscriptions" element={<MySubscriptions />} />
                            <Route path="/billing" element={<BillingHistory />} />
                            <Route path="/market" element={<Market />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/admin" element={<Admin />} />
                            {/* 잘못된 주소 라우트 추가 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;