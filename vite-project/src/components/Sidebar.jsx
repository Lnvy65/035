import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2 className="logo">SubHub</h2>
            <nav className="menu">
                <Link to="/" className="menu-item">Dashboard</Link>
                <Link to="/subscriptions" className="menu-item">My Subscriptions</Link>
                <Link to="/billing" className="menu-item">Billing History</Link>
                <Link to="/analytics" className="menu-item">Analytics</Link>
                <Link to="/settings" className="menu-item">Settings</Link>
            </nav>
        </div>
    );
}