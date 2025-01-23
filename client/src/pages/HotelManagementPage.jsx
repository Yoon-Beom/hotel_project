// client/src/pages/HotelManagementPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import useHotel from '../hooks/useHotel';
import HotelManagementList from '../components/HotelManagementList';
import AddHotel from '../components/AddHotel';
// import '../styles/pages/HotelManagementPage.css';

/**
 * 호텔 관리 페이지 컴포넌트
 * 사용자의 호텔 목록을 표시하고 새 호텔을 추가하는 기능을 제공합니다.
 * @component
 * @returns {JSX.Element} HotelManagementPage 컴포넌트
 */
const HotelManagementPage = () => {
    const { getUserHotels, fetchHotels, isLoading, error } = useHotel();
    const [userHotels, setUserHotels] = useState([]);

    /**
     * 사용자의 호텔 목록을 불러오는 비동기 함수
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
     * 새 호텔 추가 후 호출되는 핸들러
     * @async
     * @function handleHotelAdded
     */
    const handleHotelAdded = useCallback(async () => {
        await loadUserHotels();
    }, [loadUserHotels]);

    if (isLoading) return <div className="loading">호텔 정보를 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;

    return (
        <div className="hotel-management-page">
            <h1>내 호텔 관리</h1>

            <section className="add-hotel-section">
                <AddHotel onHotelAdded={handleHotelAdded} />
            </section>

            <section className="user-hotels-list">
                {userHotels.length === 0 ? (
                    <p>등록된 호텔이 없습니다.</p>
                ) : (
                    <HotelManagementList hotels={userHotels} />
                )}
            </section>
        </div>
    );
};

export default HotelManagementPage;
