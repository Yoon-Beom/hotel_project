import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../hooks/useHotel';
import { useRoom } from '../hooks/useRoom';
import useStatistics from '../hooks/useStatistics';
import { formatDate, getDateArray } from '../utils/dateUtils';
import '../styles/components/AvailableHotels.css';

const AvailableHotels = ({ checkIn, checkOut }) => {
  const navigate = useNavigate();
  const { hotels, fetchHotels, filterAvailableHotels } = useHotel();
  const { fetchRooms } = useRoom();
  const { fetchDailyReservations } = useStatistics();
  const [hotelsWithRooms, setHotelsWithRooms] = useState([]);
  const [dailyReservations, setDailyReservations] = useState({});

  // 호텔 목록 가져오기
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    const fetchHotelRooms = async () => {
      if (!hotels || !checkIn || !checkOut) return;
      
      const checkInDate = formatDate(checkIn);
      const checkOutDate = formatDate(checkOut);
  
      try {
        // 선택된 날짜 범위에 예약 가능한 호텔 필터링
        const filteredHotels = await filterAvailableHotels(checkInDate, checkOutDate);
        
        // 체크인부터 체크아웃까지의 날짜 배열 생성
        const dateArray = getDateArray(checkInDate, checkOutDate);
        
        // 각 날짜별 예약 데이터 가져오기
        const reservationsPromises = dateArray.map(date => 
          fetchDailyReservations(new Date(date).getFullYear(), new Date(date).getMonth() + 1)
        );
        const reservationsData = await Promise.all(reservationsPromises);
        
        // 날짜별 예약 데이터 병합
        const mergedReservations = reservationsData.reduce((acc, data, index) => {
          acc[dateArray[index]] = data;
          return acc;
        }, {});
        
        setDailyReservations(mergedReservations);
  
        // 각 호텔의 객실 정보와 가용성 확인 - 여기를 수정
        const hotelRoomsPromises = filteredHotels.map(async (hotel) => {
          const rooms = await fetchRooms(hotel.id);
          const roomsInfo = rooms.filter(room => {
            // 해당 기간 동안 예약이 있는지 확인
            return !dateArray.some(date => {
              const hotelReservations = mergedReservations[date]?.[hotel.id];
              // hotelReservations가 배열인지 확인 후 includes 호출
              return Array.isArray(hotelReservations) && hotelReservations.includes(room.roomNumber);
            });
          }).map(room => ({
            roomNumber: room.roomNumber,
            availability: dateArray.map(date => ({
              date,
              isAvailable: true
            }))
          }));
          
          // 예약 가능한 객실이 있는 호텔만 반환
          return roomsInfo.length > 0 ? {
            ...hotel,
            rooms: roomsInfo
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
  }, [hotels, fetchRooms, checkIn, checkOut, filterAvailableHotels, fetchDailyReservations]);

  // 예약 가능한 호텔 랜덤 선택
  const randomSelectedHotels = useMemo(() => {
    if (!hotelsWithRooms || hotelsWithRooms.length === 0) return [];
    
    const shuffled = [...hotelsWithRooms].sort(() => 0.5 - Math.random());
    const count = Math.max(2, Math.floor(Math.random() * (hotelsWithRooms.length + 1)));
    return shuffled.slice(0, count);
  }, [hotelsWithRooms]);

  // 객실 선택 시 예약 페이지로 이동
  const handleRoomClick = (hotelId, roomNumber) => {
    navigate(`/reservation/${hotelId}/${roomNumber}`, {
      state: {
        checkInDate: formatDate(checkIn),
        checkOutDate: formatDate(checkOut)
      }
    });
  };

  if (!hotelsWithRooms || hotelsWithRooms.length === 0) return null;

  return (
    <div className="available-hotels">
      <h2>예약 가능한 호텔</h2>
      <div className="hotels-grid">
        {randomSelectedHotels
          .filter(hotel => hotel.rooms && hotel.rooms.length > 0)
          .map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image">사진</div>
              <h3 className="hotel-name">{hotel.name}</h3>
              <div className="hotel-rooms">
                {hotel.rooms
                  .filter(room => room.availability.every(day => day.isAvailable))
                  .map((room) => (
                    <div 
                      key={room.roomNumber} 
                      className="room-info"
                      onClick={() => handleRoomClick(hotel.id, room.roomNumber)}
                      style={{ cursor: 'pointer' }}
                    >
                      <p className="room-number">객실 번호: {room.roomNumber}호</p>
                      <p className="room-availability">예약 가능 여부: 전 기간 예약 가능</p>
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
