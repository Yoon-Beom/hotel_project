// client/src/pages/ReservationPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useHotel from '../hooks/useHotel';
import useRoom from '../hooks/useRoom';
import AddReservation from '../components/AddReservation';
import { weiToEther } from '../utils/web3Utils';
// import '../styles/pages/ReservationPage.css';

/**
 * 예약 페이지 컴포넌트
 * 호텔 객실 정보를 표시하고 예약 폼을 제공합니다.
 * @component
 * @returns {JSX.Element} ReservationPage 컴포넌트
 */
const ReservationPage = () => {
    const { hotelId, roomId } = useParams();
    const navigate = useNavigate();
    const { getHotelInfo } = useHotel();
    const { getRoomInfo } = useRoom();
    
    const [hotel, setHotel] = useState(null);
    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * 호텔과 객실 정보를 로드하는 함수
     * @async
     * @function loadHotelAndRoom
     */
    const loadHotelAndRoom = useCallback(async () => {
        try {
            setIsLoading(true);
            const hotelData = await getHotelInfo(hotelId);
            const roomData = await getRoomInfo(hotelId, roomId);
            
            setHotel(hotelData);
            setRoom(roomData);
            setError(null);
        } catch (err) {
            setError('호텔과 객실 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [hotelId, roomId, getHotelInfo, getRoomInfo]);

    useEffect(() => {
        loadHotelAndRoom();
    }, [loadHotelAndRoom]);

    /**
     * 예약 완료 후 처리 함수
     * @function handleReservationAdded
     */
    const handleReservationAdded = () => {
        navigate('/my-reservations');
    };

    if (isLoading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;
    if (!hotel || !room) return <div className="not-found">정보를 찾을 수 없습니다.</div>;

    return (
        <div className="reservation-page">
            <h1>예약하기</h1>
            
            <div className="hotel-info">
                <h2>{hotel.name}</h2>
                <p>객실 번호: {room.roomNumber}</p>
                <p>1박 가격: {weiToEther(room.price)} ETH</p>
            </div>

            <AddReservation
                hotelId={hotelId}
                roomId={roomId}
                room={room}
                onReservationAdded={handleReservationAdded}
            />
        </div>
    );
};

export default ReservationPage;
