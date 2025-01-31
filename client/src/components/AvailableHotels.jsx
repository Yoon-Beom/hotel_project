// client/src/components/AvailableHotels.jsx

import React, { useEffect, useState } from 'react';
import { useHotel } from '../hooks/useHotel';
import { useRoom } from '../hooks/useRoom';
import '../styles/components/AvailableHotels.css';

const AvailableHotels = ({ checkIn, checkOut }) => { // MonthCalendar로부터 받은 체크인/아웃 날짜
  const { hotels, fetchHotels, filterAvailableHotels } = useHotel();
  const { fetchRooms } = useRoom();
  const [hotelsWithRooms, setHotelsWithRooms] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    const fetchHotelRooms = async () => {
      if (!hotels || hotels.length === 0) return;
      const filteredHotels = await filterAvailableHotels(checkIn, checkOut);
      const hotelRoomsPromises = filteredHotels.map(async (hotel) => {
        const rooms = await fetchRooms(hotel.id);
        // 가격 계산 로직 제거하고 객실 번호만 포함
        const roomsInfo = rooms.map(room => ({
          roomNumber: room.roomNumber
        }));
        return {
          ...hotel,
          rooms: roomsInfo
        };
      });

      const hotelsWithRoomData = await Promise.all(hotelRoomsPromises);
      setHotelsWithRooms(hotelsWithRoomData);
    };

    fetchHotelRooms();
  }, [hotels, fetchRooms, checkIn, checkOut, filterAvailableHotels]);

  const getRandomHotels = () => {
    if (!hotelsWithRooms || hotelsWithRooms.length === 0) return [];
    
    const shuffled = [...hotelsWithRooms].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * (hotelsWithRooms.length - 2 + 1)) + 2;
    return shuffled.slice(0, count);
  };

  const randomSelectedHotels = React.useMemo(() => 
    getRandomHotels(), 
    [hotelsWithRooms, checkIn, checkOut]
    
  );

  if (!hotelsWithRooms || hotelsWithRooms.length === 0) return null;

  return (
    <div className="available-hotels">
      <h2>예약 가능한 호텔</h2>
      <div className="hotels-grid">
        {randomSelectedHotels.map((hotel, index) => (
          <div key={index} className="hotel-card">
            <div className="hotel-image">사진</div>
            <h3 className="hotel-name">{hotel.name}</h3>
            <div className="hotel-rooms">
              {hotel.rooms.map((room, roomIndex) => (
                <div key={roomIndex} className="room-info">
                  <p className="room-number">객실 번호: {Number(room.roomNumber)}호</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableHotels;
