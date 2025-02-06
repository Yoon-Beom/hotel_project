// client/src/components/reservation/AvailableHotels.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../../hooks/useHotel';
import { useRoom } from '../../hooks/useRoom';
import { formatDate } from '../../utils/dateUtils';
import AvailableRoomList from './AvailableRoomList';
import '../../styles/components/reservation/AvailableHotels.css';

const AvailableHotels = ({ checkIn, checkOut }) => {
  const navigate = useNavigate();
  const { hotels, fetchHotels, filterAvailableHotels, isLoading: isHotelLoading, error: hotelError } = useHotel();
  const { getAvailableRooms, isLoading: isRoomLoading, error: roomError } = useRoom();
  const [hotelsWithRooms, setHotelsWithRooms] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    const fetchHotelRooms = async () => {
      if (!hotels || !checkIn || !checkOut) return;
      
      const checkInDate = formatDate(checkIn);
      const checkOutDate = formatDate(checkOut);
  
      try {
        const filteredHotels = await filterAvailableHotels(checkInDate, checkOutDate);
        
        const hotelRoomsPromises = filteredHotels.map(async (hotel) => {
          const availableRooms = await getAvailableRooms(hotel.id, checkInDate, checkOutDate);
          
          return availableRooms.length > 0 ? {
            ...hotel,
            rooms: availableRooms
          } : null;
        });
  
        const hotelsWithRoomData = (await Promise.all(hotelRoomsPromises))
          .filter(hotel => hotel !== null);
        
        setHotelsWithRooms(hotelsWithRoomData);
      } catch (error) {
        console.error("Error fetching hotel rooms:", error);
      }
    };
  
    fetchHotelRooms();
  }, [hotels, getAvailableRooms, checkIn, checkOut, filterAvailableHotels]);

  const handleRoomClick = (hotelId, roomNumber) => {
    navigate(`/reservation/${hotelId}/${roomNumber}`, {
      state: {
        checkInDate: formatDate(checkIn),
        checkOutDate: formatDate(checkOut)
      }
    });
  };

  if (isHotelLoading || isRoomLoading) return <div className="loading">호텔 및 객실 정보를 불러오는 중...</div>;
  if (hotelError || roomError) return <div className="error">에러: {hotelError || roomError}</div>;

  if (!hotelsWithRooms || hotelsWithRooms.length === 0) {
    return (
      <div className="no-hotels-available">
        <h2>선택하신 날짜에 예약 가능한 호텔이 없습니다.</h2>
      </div>
    );
  }

  return (
    <div className="available-hotels">
      <h2>예약 가능한 호텔</h2>
      <div className="hotels-grid">
        {hotelsWithRooms.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <div className="hotel-image">
              {hotel.imageUrl ? (
                <img src={hotel.imageUrl} alt={hotel.name} />
              ) : (
                <div className="placeholder-image">사진</div>
              )}
            </div>
            <h3 className="hotel-name">{hotel.name}</h3>
            <AvailableRoomList 
              hotelId={hotel.id}
              checkInDate={formatDate(checkIn)}
              checkOutDate={formatDate(checkOut)}
              onRoomClick={handleRoomClick}
              rooms={hotel.rooms}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableHotels;
