import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Login from './pages/Login';
import Admin from './pages/Admin';

import './App.css'; 

// 임시 페이지들
const MySubscriptions = () => <div className="page-content"><h1>My Subscriptions 페이지</h1></div>;
const BillingHistory = () => <div className="page-content"><h1>Billing History 페이지</h1></div>;

function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">
                <Sidebar />
                <div className="main-wrapper">
                    <Header />
                    <div className="content-area">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/subscriptions" element={<MySubscriptions />} />
                            <Route path="/billing" element={<BillingHistory />} />
                            <Route path="/market" element={<Market />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/admin" element={<Admin />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;