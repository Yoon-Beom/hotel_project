// HotelManagementPage.jsx
import React, { useEffect } from 'react';
import { useHotel } from '../hooks/useHotel';
import HotelManagementList from '../components/HotelManagementList';
import AddHotel from '../components/AddHotel';

const HotelManagementPage = () => {
    const { userHotels, fetchHotels } = useHotel();

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    const handleHotelAdded = () => {
        fetchHotels(); // 새 호텔이 추가되면 목록을 다시 불러옵니다.
    };

    return (
        <div className="hotel-management-page">
            <h1>내 호텔 관리</h1>
            
            <section className="add-hotel-section">
                <h2>새 호텔 등록</h2>
                <AddHotel onHotelAdded={handleHotelAdded} />
            </section>

            <section className="user-hotels-list">
                <h2>내 호텔 목록</h2>
                {userHotels.length === 0 ? (
                    <p>등록된 호텔이 없습니다.</p>
                ) : (
                    <HotelManagementList />
                )}
            </section>
        </div>
    );
};

export default HotelManagementPage;
