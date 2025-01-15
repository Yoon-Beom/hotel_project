import React from 'react';
import RoomList from './RoomList';

const HotelCard = ({ hotel }) => {
    return (
        <div className="hotel-card">
            <h3>{hotel.name}</h3>
            <p>주소: {hotel.manager}</p>
            <p>IPFS 해시: {hotel.ipfsHash}</p>
            <p>상태: {hotel.isActive ? '영업 중' : '영업 중지'}</p>

            <RoomList hotelId={hotel.id} />
        </div>
    );
};

export default HotelCard;
