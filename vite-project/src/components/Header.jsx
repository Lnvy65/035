import React from 'react';
import './Header.css';

export default function Header() {
    return (
        <header className="header">
            <div className="top-nav">
                <span>Home</span>
                <span className="active">MyPage</span>
                <span>Subscriptions</span>
                <span>Profile</span>
            </div>
        </header>
    );
}