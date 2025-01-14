import React from 'react';
import HotelCard from './HotelCard';

const HotelList = ({ hotels, addRoom }) => {
    return (
        <div>
            <h2>호텔 목록</h2>
            <ul>
                {hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} addRoom={addRoom} />
                ))}
            </ul>
        </div>
    );
};

export default HotelList;
