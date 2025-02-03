// client/src/components/AvailableHotels.jsx
import React, { useEffect, useState } from 'react';
import { useHotel } from '../hooks/useHotel';
import { useRoom } from '../hooks/useRoom';
import { useDate } from '../hooks/useDate';  // useDate 훅 추가
import '../styles/components/AvailableHotels.css';

const AvailableHotels = ({ checkIn, checkOut }) => {
  const { hotels, fetchHotels } = useHotel();
  const { getAvailableRooms } = useRoom();
  const { formatToYYYYMMDD } = useDate();  // useDate에서 변환 함수 가져오기
  const [hotelsWithRooms, setHotelsWithRooms] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!hotels || hotels.length === 0 || !checkIn || !checkOut) return;

      // useDate 훅의 함수를 사용하여 날짜 변환
      const checkInDate = formatToYYYYMMDD(checkIn);
      const checkOutDate = formatToYYYYMMDD(checkOut);

      const hotelRoomsPromises = hotels.map(async (hotel) => {
        try {
          const availableRooms = await getAvailableRooms(
            hotel.id,
            checkInDate,
            checkOutDate
          );

          if (availableRooms && availableRooms.length > 0) {
            return {
              ...hotel,
              rooms: availableRooms.map(room => ({
                roomNumber: room.roomNumber
              }))
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching rooms for hotel ${hotel.id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(hotelRoomsPromises);
      const hotelsWithAvailableRooms = results.filter(hotel => hotel !== null);
      setHotelsWithRooms(hotelsWithAvailableRooms);
    };

    fetchAvailableRooms();
  }, [hotels, checkIn, checkOut, getAvailableRooms, formatToYYYYMMDD]);

  const getRandomHotels = () => {
    if (!hotelsWithRooms || hotelsWithRooms.length === 0) return [];
    
    const shuffled = [...hotelsWithRooms].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * (hotelsWithRooms.length - 2 + 1)) + 2;
    return shuffled.slice(0, count);
  };

  const randomSelectedHotels = React.useMemo(() => 
    getRandomHotels(), 
    [hotelsWithRooms]
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
