import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import './Sidebar.css';

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        const isConfirm = window.confirm("정말 로그아웃 하시겠습니까?");
        if (isConfirm) {
            try {
                await signOut(auth);
                alert("안전하게 로그아웃 되었습니다.");
                navigate('/login'); // 로그아웃 성공 시 로그인 페이지로 이동
            } catch (error) {
                console.error("로그아웃 에러:", error);
                alert("로그아웃에 실패했습니다.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="sidebar">
            <h2 className="logo">SubHub</h2>
            <nav className="menu">
                {user ? (
                    <>
                        <Link to="/" className="menu-item">Dashboard</Link>
                        <Link to="/subscriptions" className="menu-item">My Subscriptions</Link>
                        <Link to="/billing" className="menu-item">Billing History</Link>
                        <Link to="/analytics" className="menu-item">Analytics</Link>
                        <Link to="/settings" className="menu-item">Settings</Link>
                        <button className="menu-item logout-btn" onClick={handleLogout}>
                            logout
                        </button>
                    </>
                    
                ) : (
                    <Link to="/login" className="menu-item">Login</Link>
                )}
            </nav>
        </div>
    );
};

export default Sidebar;