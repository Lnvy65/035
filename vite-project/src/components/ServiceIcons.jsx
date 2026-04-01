import React from 'react';

export default function ServiceIcon({ name, iconFromDB }) {
    const officialIcons = {
        '넷플릭스 프리미엄': '🍿',
        '유튜브 프리미엄': '▶️',
        '디즈니+': '🏰',
        '쿠팡 와우': '🚀',
        '스포티파이': '🎧',
        '멜론': '🍈',
        '개인 헬스장': '🏋️',
        '크리에이터 후원': '💝',
        '어도비': '🎨'
    };

    const displayIcon = iconFromDB || officialIcons[name] || '📁';

    return (
        <span className="service-icon" style={{ marginRight: '8px', fontSize: '1.2em' }}>
            {displayIcon}
        </span>
    );
}