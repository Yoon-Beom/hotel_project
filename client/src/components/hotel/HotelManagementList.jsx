// client/src/components/hotel/HotelManagementList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import useHotel from '../../hooks/useHotel';
import AddRoom from '../room/AddRoom';
import RoomList from '../room/RoomList';
import '../../styles/components/hotel/HotelManagementList.css';

/**
 * 사용자의 호텔 관리 목록을 표시하는 컴포넌트
 * @component
 * @returns {JSX.Element} HotelManagementList 컴포넌트
 */
const HotelManagementList = () => {
    const { getUserHotels, fetchHotels, isLoading, error } = useHotel();
    const [userHotels, setUserHotels] = useState([]);

    /**
     * 사용자의 호텔 목록을 로드하는 함수
     * @async
     * @function loadUserHotels
     */
    const loadUserHotels = useCallback(async () => {
        await fetchHotels();
        const hotels = getUserHotels();
        setUserHotels(hotels);
    }, [fetchHotels, getUserHotels]);

    useEffect(() => {
        loadUserHotels();
    }, [loadUserHotels]);

    /**
     * 객실 추가 후 호출되는 핸들러
     * @async
     * @function handleRoomAdded
     */
    const handleRoomAdded = async () => {
        await loadUserHotels();
    };

    if (isLoading) return <div className="loading">호텔 정보를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;

    return (
        <div className="hotel-management-list">
            {userHotels.length === 0 ? (
                <p>관리 중인 호텔이 없습니다.</p>
            ) : (
                userHotels.map(hotel => (
                    <div key={hotel.id} className="hotel-item">
                        <section className="hotel-info-section">
                            <label><h3>등록된 호텔 정보</h3></label>
                            <div className="hotel-info-container">
                                <div className="hotel-image-container">
                                    <div className="hotel-image-placeholder">
                                        호텔 이미지 준비중
                                    </div>
                                    <div className="image-navigation">
                                        <button className="nav-button">◀</button>
                                        <button className="nav-button">▶</button>
                                    </div>
                                </div>
                                <table className="hotel-info-table">
                                    <tbody>
                                        <tr>
                                            <td className="label">호텔명</td>
                                            <td className="value">{hotel.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">IPFS 해시</td>
                                            <td className="value">{hotel.ipfsHash}</td>
                                        </tr>
                                        <tr>
                                            <td className="label">상태</td>
                                            <td className="value">{hotel.isActive ? '활성' : '비활성'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        
                        
                        
                        <section className="room-list-section">
                            <RoomList hotelId={hotel.id} />
                        </section>


                        <section className="add-room-section">
                            <AddRoom hotelId={hotel.id} onRoomAdded={handleRoomAdded} />
                        </section>
                    </div>
                ))
            )}
        </div>
    );
};

export default HotelManagementList;
