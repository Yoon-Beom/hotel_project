import React, { useEffect } from 'react';
import { useHotel } from '../hooks/useHotel';
import AddRoom from './AddRoom';
import RoomList from './RoomList';

const HotelManagementList = () => {
    const { userHotels, fetchHotels } = useHotel();

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    const handleRoomAdded = () => {
        fetchHotels(); // 객실이 추가되면 호텔 정보를 다시 불러옵니다.
    };

    return (
        <div>
            {userHotels.map(hotel => (
                <div key={hotel.id}>
                    <h3>{hotel.name}</h3>
                    <p>IPFS 해시: {hotel.ipfsHash}</p>
                    
                    <AddRoom hotelId={hotel.id} onRoomAdded={handleRoomAdded} />
                    
                    <RoomList hotelId={hotel.id} />
                </div>
            ))}
        </div>
    );
};

export default HotelManagementList;
