import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../hooks/useHotel';
import { useRoom } from '../hooks/useRoom';
import { formatDate } from '../utils/dateUtils';
import '../styles/components/AvailableHotels.css';
import { weiToEther } from '../utils/web3Utils';

const AvailableHotels = ({ checkIn, checkOut }) => {
  const navigate = useNavigate();
  const { hotels, fetchHotels, filterAvailableHotels } = useHotel();
  const { getAvailableRooms } = useRoom();
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
          
          // 예약 가능한 객실이 있는 호텔만 반환
          return availableRooms.length > 0 ? {
            ...hotel,
            rooms: availableRooms.map(room => ({
              ...room,
              isAvailable: true // 이미 getAvailableRooms에서 필터링된 객실들이므로 모두 예약 가능
            }))
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
            <div className="hotel-rooms">
              {hotel.rooms.map((room) => (
                <div 
                  key={room.roomNumber} 
                  className="room-info"
                  onClick={() => handleRoomClick(hotel.id, room.roomNumber)}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="room-number">객실 번호: {room.roomNumber}호</p>
                  <p className="room-price">가격: {weiToEther(room.price)} ETH</p>
                  <p className="room-status">예약 가능</p>
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
