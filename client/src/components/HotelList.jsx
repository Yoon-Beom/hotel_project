import React, { useEffect, useState } from 'react';
import useHotel from '../hooks/useHotel';
import useWeb3 from '../hooks/useWeb3';
import RoomList from './RoomList';
// import '../styles/components/HotelList.css';

/**
 * 호텔 목록을 표시하는 컴포넌트
 * @component
 * @returns {JSX.Element} HotelList 컴포넌트
 */
const HotelList = () => {
    const { hotels, fetchHotels, isLoading, error } = useHotel();
    const { account } = useWeb3();
    const [selectedHotel, setSelectedHotel] = useState(null);

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    /**
     * 호텔 선택 핸들러
     * @param {Object} hotel - 선택된 호텔 객체
     */
    const handleHotelSelect = (hotel) => {
        setSelectedHotel(hotel.id === selectedHotel ? null : hotel.id);
    };

    /**
     * 이더리움 주소를 축약하여 표시
     * @param {string} address - 이더리움 주소
     * @returns {string} 축약된 주소
     */
    const shortenAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (isLoading) return <div className="loading">호텔 목록을 불러오는 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;

    return (
        <div className="hotel-list">
            <h2>호텔 목록</h2>
            {hotels.map((hotel) => (
                <div key={hotel.id} className="hotel-item">
                    <h3 onClick={() => handleHotelSelect(hotel)} className="hotel-name">
                        {hotel.name}
                    </h3>
                    <p>관리자: {shortenAddress(hotel.manager)}</p>
                    <p>IPFS 해시: {hotel.ipfsHash}</p>
                    <p>활성 상태: {hotel.isActive ? '활성' : '비활성'}</p>
                    
                    {selectedHotel === hotel.id && (
                        <RoomList hotelId={hotel.id} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default HotelList;
