// client/src/components/HotelManagementList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import useHotel from '../hooks/useHotel';
import AddRoom from './AddRoom';
import RoomList from './RoomList';
// import '../styles/components/HotelManagementList.css';

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
            <h2>내 호텔 관리</h2>
            {userHotels.length === 0 ? (
                <p>관리 중인 호텔이 없습니다.</p>
            ) : (
                userHotels.map(hotel => (
                    <div key={hotel.id} className="hotel-item">
                        <h3>{hotel.name}</h3>
                        <p>IPFS 해시: {hotel.ipfsHash}</p>
                        <p>활성 상태: {hotel.isActive ? '활성' : '비활성'}</p>
                        
                        <AddRoom hotelId={hotel.id} onRoomAdded={handleRoomAdded} />
                        
                        <RoomList hotelId={hotel.id} />
                    </div>
                ))
            )}
        </div>
    );
};

export default HotelManagementList;
