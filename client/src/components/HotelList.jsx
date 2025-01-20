// client/src/components/HotelList.jsx
import React, { useEffect } from 'react';
import { useHotel } from '../hooks/useHotel';
import RoomList from './RoomList';
import useWeb3 from '../hooks/useWeb3';

const HotelList = () => {
    const { hotels, fetchHotels } = useHotel();
    const { web3 } = useWeb3();

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    return (
        <div>
            <h2>호텔 목록</h2>
            {hotels.map((hotel) => (
                <div key={hotel.id}>
                    <h3>{hotel.name}</h3>
                    <p>주소: {hotel.manager}</p>
                    <p>IPFS 해시: {hotel.ipfsHash}</p>
                    <p>활성 상태: {hotel.isActive ? '활성' : '비활성'}</p>
                    
                    <RoomList hotelId={hotel.id} />
                </div>
            ))}
        </div>
    );
};

export default HotelList;
