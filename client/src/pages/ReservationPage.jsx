// client/src/pages/ReservationPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useHotel from '../hooks/useHotel';
import useRoom from '../hooks/useRoom';
import AddReservation from '../components/reservation/AddReservation';
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

     // 새로운 상태 추가
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const location = useLocation();
    
    /**
     * 호텔과 객실 정보를 로드하는 함수
     * @async
     * @function loadHotelAndRoom
     */
    const loadHotelAndRoom = useCallback(async () => {
        try {
            setIsLoading(true);
            const hotelData = await getHotelInfo(Number(hotelId));
            const roomData = await getRoomInfo(Number(hotelId), Number(roomId));

            console.log("변환 x , ReservationPage에서 넘겨주는 값 checkInDate, checkOutDate : " , checkInDate, checkOutDate)
            
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
   
    useEffect(() => {
        if (location.state) {
            setCheckInDate(location.state.checkInDate);
            setCheckOutDate(location.state.checkOutDate);
            console.log("checkInDate, checkOutDate from reservationPage : ", checkInDate, checkOutDate )
        }
    }, [location.state]);


// =============================================================================
// AvailableHotels(체크인/아웃 날짜) => ReservationPage(형변환) => AddReservation(날짜 선택할 때 미리 설정되도록)
// =============================================================================
/**
 * 날짜 문자열을 'YYYY-MM-DD' 형식으로 변환하는 함수
 * @param {string} dateString - 변환할 날짜 문자열 (YYMMDD 또는 YYYYMMDD 형식)
 * @returns {string} 'YYYY-MM-DD' 형식의 날짜 문자열
 */
/*
    const convertToDateInputFormat = (dateString) => {
    if (!dateString) return '';
    if (typeof dateString !== 'string') return '';
    if (dateString.includes('-')) return dateString; // 이미 'YYYY-MM-DD' 형식인 경우

    let year, month, day;
    if (dateString.length === 8) {
        // YYYYMMDD 형식
        year = dateString.slice(0, 4);
        month = dateString.slice(4, 6);
        day = dateString.slice(6, 8);
    } else {
        console.error("Invalid date string format:", dateString);
        return '';
    }

    return `${year}-${month}-${day}`;
    };
    */

   
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
                hotelId={Number(hotelId)}
                roomId={Number(roomId)}
                room={room}
                initialCheckIn={checkInDate}
                initialCheckOut={checkOutDate}
                onReservationAdded={handleReservationAdded}
            />
        </div>
    );
};

export default ReservationPage;