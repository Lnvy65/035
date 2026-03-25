import React, { useState, useEffect } from 'react';
import './Admin.css';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';

export default function Admin(){
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userSubs, setUserSubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchAllUsers = async () =>{
            try{
                const querySnapshot = await getDocs(collection(db,'users'));
                const userData = [];
                querySnapshot.forEach((doc) => {
                    userData.push({ id: doc.id, ...doc.data() });
                });
            setUsers(userData);
            }catch(error){
                console.error('유저 목록 에러 발생',error);
            }finally{
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, []);

    const handleUserClick = async(user) => {
        setSelectedUser(user);
        setUserSubs([]);

        try{
            const q = query(collection(db, 'subscriptions'), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            const subsData = [];
            querySnapshot.forEach((doc) => {
                subsData.push({ id: doc.id, ...doc.data() })
            });
            setUserSubs(subsData);
        } catch (error){
            console.error("구독 내역 불러오기 오류", error);
        }
    };


    const handleDeleteUser = async (targetUser) => {
        const isConfirm = window.confirm(`⚠️ 정말 [${targetUser.name}] 님의 모든 정보와 구독 내역을 삭제하시겠습니까?`);
        
        if (isConfirm) {
            try {
                                
                const q = query(collection(db, 'subscriptions'), where("userId", "==", targetUser.uid || targetUser.id));
                const querySnapshot = await getDocs(q);
                
                const deletePromises = [];
                querySnapshot.forEach((subDoc) => {
                    if (subDoc.id) { 
                        deletePromises.push(deleteDoc(doc(db, 'subscriptions', subDoc.id))); 
                    }
                });
                await Promise.all(deletePromises); 

                if (targetUser.id) {
                    await deleteDoc(doc(db, 'users', targetUser.id));
                } else {
                    console.error("ID가 없어서 users 폴더에서는 지우지 못했습니다.");
                }

                setUsers(users.filter((user) => user.id !== targetUser.id));
                setSelectedUser(null);
                setUserSubs([]);

                alert(`${targetUser.name} 님의 모든 데이터가 삭제되었습니다.`);

            } catch (error) {
                console.error('유저 삭제 중 에러 발생 상세:', error);
            }
        }
    };

    if (loading) return <div className="admin-container"><h2>데이터를 불러오는 중...</h2></div>;
    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>관리자 대시보드</h2>
                <p>전체 회원의 구독 상태를 조회합니다.</p>
            </div>

            <div className="admin-content">
                {/* 왼쪽: 전체 유저 목록 */}
                <div className="user-list-section">
                    <h3>전체 유저 ({users.length}명)</h3>
                    <ul className="user-list">
                        {users.map((user) => (
                            <li 
                                key={user.id} 
                                className={selectedUser?.uid === user.uid ? 'active' : ''}
                                onClick={() => handleUserClick(user)}
                            >
                                <div className="user-name">{user.name}</div>
                                <div className="user-email">{user.email}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 오른쪽: 선택된 유저의 구독 상세 내역 */}
                <div className="user-detail-section">
                    {!selectedUser ? (
                        <div className="empty-state">왼쪽에서 조회할 유저를 선택해 주세요.</div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f3f5', paddingBottom: '12px', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
                                    {selectedUser.name} 님의 구독 내역 ({userSubs.length}개)
                                </h3>
                                <button 
                                    onClick={() => handleDeleteUser(selectedUser)}
                                    style={{ backgroundColor: '#fff0f0', color: '#e03131', border: '1px solid #ffc9c9', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    유저 영구 삭제
                                </button>
                            </div>
                            <h3>{selectedUser.name} 님의 구독 내역 ({userSubs.length}개)</h3>
                            {userSubs.length === 0 ? (
                                <p className="empty-state">이 유저는 아직 등록한 구독이 없습니다.</p>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>서비스</th>
                                            <th>월 요금</th>
                                            <th>카테고리</th>
                                            <th>상태</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userSubs.map((sub) => (
                                            <tr key={sub.id}>
                                                <td>{sub.name}</td>
                                                <td>₩ {Number(sub.price).toLocaleString()}</td>
                                                <td>{sub.category}</td>
                                                <td><span className="status-badge">{sub.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
