import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import './Sidebar.css';

const Sidebar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

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
                    </>
                ) : (
                    <Link to="/login" className="menu-item">Login</Link>
                )}
            </nav>
        </div>
    );
};

export default Sidebar;